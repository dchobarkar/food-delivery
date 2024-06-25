"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@apollo/client";

import { GET_RESTAURANT } from "../graphql/actions/get-restaurant.action";

const useRestaurant = () => {
  const { loading, data } = useQuery(GET_RESTAURANT);

  useEffect(() => {
    if (
      !loading &&
      data?.getLoggedInRestaurant?.restaurant.refresh_token &&
      data?.getLoggedInRestaurant?.restaurant.access_token
    ) {
      const restaurantData = data?.getLoggedInRestaurant;
      Cookies.set("access_token", restaurantData.access_token);
      Cookies.set("refresh_token", restaurantData.refresh_token);
    }
  }, [data?.getLoggedInRestaurant, loading]);

  return {
    loading,
    restaurant: data?.getLoggedInRestaurant?.restaurant,
  };
};

export default useRestaurant;
