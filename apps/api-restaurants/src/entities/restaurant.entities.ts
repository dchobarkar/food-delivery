import { ObjectType, Field, Directive } from "@nestjs/graphql";

@ObjectType()
@Directive('@key(fields:"id")')
export class Avatars {
  @Field()
  id: string;

  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  seller_id: string;
}

@ObjectType()
export class Restaurant {
  @Field()
  id?: string;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  address: string;

  @Field()
  email: string;

  @Field(() => Avatars, { nullable: true })
  avatar?: Avatars | null;

  @Field()
  phone_number: number;

  @Field()
  password: string;

  @Field()
  created_at?: Date;

  @Field()
  updated_at?: Date;
}
