import { Button, Flex, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { editFramework } from "../../../api/frameworkHandlers";

export default function EditFwForm({
   id,
   fwName,
   fw,
   invalidate,
   setInvalidate,
   editFw,
   setEditFw,
}) {
   const form = useForm({
      initialValues: {
         frameworkName: fwName,
         framework: fw,
      },
   });

   const handleChangeFw = (vals) => {
      console.log(vals);
      editFramework(id, vals)
         .then((res) => {
            console.log(res);
            setInvalidate(invalidate + 1);
            setEditFw(!editFw);
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <form onSubmit={form.onSubmit((vals) => handleChangeFw(vals))}>
         <Flex direction={"column"}>
            <TextInput
               required
               label={"Framework Name"}
               {...form.getInputProps("frameworkName")}
            />
            <Textarea
               required
               rows={8}
               label={"Framework"}
               {...form.getInputProps("framework")}
            />
         </Flex>
         <Button type={"submit"}>Save</Button>
      </form>
   );
}
