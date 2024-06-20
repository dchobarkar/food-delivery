"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { foodCategoryItems } from "../../../app/configs/constants";
import { CREATE_FOOD } from "../../../graphql/actions/create.food";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  estimatedPrice: z.number(),
  category: z.string(),
  images: z.array(z.string()),
});

type createFoodSchema = z.infer<typeof formSchema>;

const CreateFood = () => {
  const [dragging, setDragging] = useState(false);
  const [createFoodMutation] = useMutation(CREATE_FOOD);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<createFoodSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: createFoodSchema) => {
    try {
      await createFoodMutation({
        variables: {
          createFoodDto: {
            name: data.name,
            description: data.description,
            category: data.category,
            price: data.price,
            estimatedPrice: data.estimatedPrice,
            images: data.images,
          },
        },
      }).then((res) => {
        toast.success("Food uploaded successfully!");
        reset();
        redirect("/foods");
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    setDragging(false);
  };

  // This is for selecting feature
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageArray = files.map((file) => {
        const reader = new FileReader();

        return new Promise<string>((resolve) => {
          reader.onload = () => {
            if (reader.readyState === 2) resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imageArray).then((imageUrls) => {
        setValue("images", imageUrls);
      });
    }
  };

  // For drag and drop feature
  const handleImageDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    setDragging(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const imageArray = files.map((file) => {
        const reader = new FileReader();

        return new Promise<string>((resolve) => {
          reader.onload = () => {
            if (reader.readyState === 2) resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imageArray).then((imageUrls) => {
        setValue("images", imageUrls);
      });
    }
  };

  return (
    <div className="w-full pb-10">
      <div className="md:w-[70%] w-full m-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <div>
            <label className="label">Enter Food Name</label>

            <input
              {...register("name")}
              type="text"
              placeholder="Paneer Cheese Biryani"
              className="input"
            />

            {errors.name && (
              <span className="text-red-500 block mt-1">
                {errors.name?.message}
              </span>
            )}
          </div>

          <div>
            <label className="label mt-2">Enter Food Description</label>

            <textarea
              {...register("description")}
              rows={8}
              cols={25}
              placeholder="This Paneer Cheese Biryani has spicy barbecue sauce, peppers, onion, and cilantro, all covered with cheese and baked to bubbly goodness! This is similar to a recipe I had at a popular pizza place in California. My family loves it!"
              className="input !h-[unset] !p-2"
            />

            {errors.description && (
              <span className="text-red-500 block mt-1">
                {errors.description?.message}
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap justify-between">
            <div className="w-[48%]">
              <label className="label mt-2">Enter Food Price</label>

              <input
                {...register("price", {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="12"
                className="input"
              />

              {errors.price && (
                <span className="text-red-500 block mt-1">
                  {errors.price?.message}
                </span>
              )}
            </div>

            <div className="w-[48%]">
              <label className="label mt-2">Enter Food Estimated price</label>

              <input
                {...register("estimatedPrice", {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="25"
                className="input"
              />

              {errors.estimatedPrice && (
                <span className="text-red-500 block mt-1">
                  {errors.estimatedPrice?.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="label mt-2">Select Food Category</label>

            <select
              className="input"
              {...register("category")}
              onChange={(e) => {
                setValue("category", e.target.value);
              }}
            >
              {foodCategoryItems.map((item: FoodCategoryType) => (
                <option value={item.title} key={item.title}>
                  {item.title}
                </option>
              ))}
            </select>

            {errors.category && (
              <span className="text-red-500 block mt-1">
                {errors.category?.message}
              </span>
            )}
          </div>

          <div>
            <label className="label mt-3">Upload Food images</label>

            <div className="w-full">
              <input
                id="file"
                type="file"
                required
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageFileChange}
              />

              <label
                htmlFor="file"
                className={`w-full mt-2 rounded-md min-h-[15vh] border-white p-3 border flex items-center justify-center ${
                  dragging ? "bg-blue-500" : "bg-transparent"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleImageDrop}
              >
                {watch("images") ? (
                  <>
                    {watch("images")?.map((img: string) => (
                      <Image
                        key={img}
                        src={img}
                        alt=""
                        width={300}
                        height={300}
                        className="w-full md:w-[48%] object-cover md:m-2 my-2"
                      />
                    ))}
                  </>
                ) : (
                  <span className="text-white">
                    Drag and drop your food images here or click to browse
                  </span>
                )}
              </label>
            </div>
          </div>

          <input
            type="submit"
            value={"create"}
            disabled={isSubmitting}
            className="button !w-[200px] mt-5 !p-0 !text-2xl"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
