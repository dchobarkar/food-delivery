import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Images {
  @Field()
  public_id: string;

  @Field()
  url: string;
}

@ObjectType()
export class Food {
  @Field()
  id?: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  estimated_price: number;

  @Field()
  category: string;

  @Field(() => [Images])
  images: Images[];

  @Field()
  restaurant_id: string;

  @Field()
  created_at?: Date;

  @Field()
  updated_at?: Date;
}
