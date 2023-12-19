import { Box, Button, Container, Flex, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

export default function MainForm() {
   const formdata = useForm({
      initialValues: {
         descriptionOfProduct: "",
         problemTheProductSolves: "",
         uniqueSellingPoint: "",
         frameworkOfEmail: "",
         targetCompany: "",
         targetCompanyDomain: "",
         targetCompanyKeyFindings: "",
         targetDecisionMaker: "",
         targetDdecisionMakerKeyFindings: "",
         subjectLine: false,
         messageIdea: "",
         toneOfMessage: "",
         goalOfEmail: "",
      },
   });

   return (
      <Container size={1400}>
         <Title my={40}>Tell us about your business!</Title>
         <form>
            <Flex
               direction={"column"}
               rowGap={16}
            >
               <TextInput
                  label={"Description of Your Product or Service"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("descriptionOfProduct")}
               />
               <TextInput
                  label={"Problems that Your Product/service Solves"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("problemTheProductSolves")}
               />
               <TextInput
                  label={"Unique Selling Point of your Product/Service"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("uniqueSellingPoint")}
               />
               <TextInput
                  label={"Framework for Email"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("frameworkOfEmail")}
               />
               <TextInput
                  label={"Target Company"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("targetCompany")}
               />
               <TextInput
                  label={"Key Finding about Target Company"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("targetCompanyKeyFindings")}
               />
               <TextInput
                  label={"Target Decision Maker Name"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("targetDecisionMaker")}
               />
               <TextInput
                  label={"Key Findings about Target Decision Maker"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("targetDdecisionMakerKeyFindings")}
               />
               <TextInput
                  label={"Subject Line Idea"}
                  maw={500}
                  disabled={false}
                  {...formdata.getInputProps("subjectLine")}
               />

               <TextInput
                  label={"Message Idea"}
                  maw={500}
                  disabled={false}
                  {...formdata.getInputProps("messageIdea")}
               />
               <TextInput
                  label={"Tone of Message"}
                  maw={500}
                  disabled={false}
                  {...formdata.getInputProps("toneOfMessage")}
               />
               <TextInput
                  label={"Goal of the Email"}
                  maw={500}
                  required={true}
                  disabled={false}
                  {...formdata.getInputProps("goalOfEmail")}
               />
               <Button w={150}>Generate Email</Button>
            </Flex>
         </form>
         <Box h={80}></Box>
      </Container>
   );
}
