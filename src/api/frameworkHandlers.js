import { privateInstance, publicInstance } from "./instances";

export const getAllFrameworks = async () => {
   const res = await publicInstance.get("/frameworks/");
   return res;
};

export const createFramework = async (body) => {
   const res = await privateInstance.post("/frameworks/", body);
   return res;
};

export const editFramework = async (id, body) => {
   const res = await privateInstance.put(`/frameworks/${id}`, body);
   return res;
};

export const deleteFramework = async (id) => {
   const res = await privateInstance.delete(`/frameworks/${id}`);
   return res;
};
