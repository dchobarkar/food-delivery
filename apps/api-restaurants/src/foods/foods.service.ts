import { Response } from "express";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { CreateFoodDto, DeleteFoodDto } from "./dto/foods.dto";
import { PrismaService } from "@/api-restaurants/prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

type Images = {
  public_id: string;
  url: string;
};

type Food = {
  name: string;
  description: string;
  price: number;
  estimated_price: number;
  category: string;
  images: Images[] | any;
};

@Injectable()
export class FoodsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}
  // Create new food
  async createFood(createFoodDto: CreateFoodDto, req: any, response: Response) {
    try {
      const { name, description, price, estimated_price, category, images } =
        createFoodDto as Food;
      const restaurantId = req.restaurant?.id;
      let foodImages: Images | any = [];

      for (const image of images) {
        if (typeof image === "string") {
          const data = await this.cloudinaryService.upload(image);
          foodImages.push({
            public_id: data.public_id,
            url: data.secure_url,
          });
        }
      }

      const foodData = {
        name,
        description,
        price,
        estimated_price,
        category,
        images: {
          create: foodImages.map(
            (image: { public_id: string; url: string }) => ({
              public_id: image.public_id,
              url: image.url,
            })
          ),
        },
        restaurant_id: restaurantId,
      };

      await this.prismaService.foods.create({
        data: foodData,
      });

      return { message: "Food Created Successfully!" };
    } catch (error) {
      return { message: error };
    }
  }

  // Get current restaurant all foods
  async getLoggedInRestuarantFood(req: any, res: Response) {
    const restaurantId = req.restaurant?.id;

    try {
      return await this.prismaService.foods.findMany({
        where: {
          restaurantId,
        },
        include: {
          images: true,
          restaurant: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Delete food of a restaurant
  async deleteFood(deleteFoodDto: DeleteFoodDto, req: any) {
    const restaurantId = req.restaurant?.id;

    const food = await this.prismaService.foods.findUnique({
      where: {
        id: deleteFoodDto.id,
      },
      include: {
        restaurant: true,
        images: true,
      },
    });

    if (food.restaurant.id !== restaurantId)
      throw Error("Only restaurant owner can delete the food!");

    // Delete the related images
    await this.prismaService.images.deleteMany({
      where: {
        foodId: deleteFoodDto.id,
      },
    });

    // Delete the food data
    await this.prismaService.foods.delete({
      where: {
        id: deleteFoodDto.id,
      },
    });

    return { message: "Food deleted successfully!" };
  }
}
