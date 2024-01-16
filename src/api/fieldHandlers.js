import { privateInstance, publicInstance } from "./instances";

export const getAllFields = async () => {
   const res = await publicInstance.get("/fields/");
   return res;
};

export const createField = async (body) => {
   const res = await privateInstance.post("/fields/", body);
   return res;
};

export const editField = async (id, body) => {
   const res = await privateInstance.put(`/fields/${id}`, body);
   return res;
};

export const deleteField = async (id) => {
   const res = await privateInstance.delete(`/fields/${id}`);
   return res;
};
