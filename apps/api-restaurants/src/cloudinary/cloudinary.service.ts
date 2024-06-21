import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";
import { Injectable } from "@nestjs/common";

type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
  async upload(data: string): Promise<CloudinaryResponse> {
    try {
      const result = await cloudinary.uploader.upload(data, {
        folder: "Foods",
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
