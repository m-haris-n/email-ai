import { privateInstance, publicInstance } from "./instances";

export const getLatestTurns = async () => {
   const res = await publicInstance.get("/turns/");
   return res;
};

export const createTurns = async (body) => {
   const res = await privateInstance.post("/turns/", body);
   return res;
};
