import {
   Box,
   Button,
   Checkbox,
   Container,
   CopyButton,
   Divider,
   Flex,
   Group,
   Select,
   Text,
   TextInput,
   Textarea,
   Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import OpenAI from "openai";
import React, { useState } from "react";

const framework1 = `Subject: Observation
   Message:
   Hey (first name),
   Personalisation line (some observation about business or decision maker)
   Link observation to pain business is solving Impact line (what impact this is having for the business)
   Link impact to how company can solve this problem
   Call to action\n
   `;

const framework2 = `
Subject: ((account trigger))
Hey ((firstname)),
You recently ((trigger)). ((recognition))
What we often see with ((industry)) is that ((business impact related to trigger))
The challenge ((business challenge & root cause)).
((validating question))
Cheers / Best / Regards,
\n
`;

const prompt1p1 = `Write a cold email to a prospect, below is the details for the cold email:\n`;
const prompt1p2 = `Each sentence should have max 9 words so that it is easy to use. The language should be such that even 6th grader would understand what is talked about.\n`;

const prompt2 = `You are an professional cold email copywriter. Write the best email that you think will get most discussions opened based on this specification. Use the data below:\n`;

const baseMsg = [
   {
      role: "system",
      content: "You are a professional copywriter who writes cold emails.",
   },
];

// const suffix = "\nDon't add double next lines";

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
         subjectLine: "",
         messageIdea: "",
         toneOfMessage: "",
         goalOfEmail: "",
      },
      validate: {
         descriptionOfProduct: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         problemTheProductSolves: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         uniqueSellingPoint: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         frameworkOfEmail: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         targetCompany: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         targetCompanyDomain: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         targetCompanyKeyFindings: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         targetDecisionMaker: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         targetDdecisionMakerKeyFindings: (value) =>
            value.length > 0 ? null : "Please fill out the field",
         goalOfEmail: (value) =>
            value.length > 0 ? null : "Please fill out the field",
      },
   });

   const [email1, setEmail1] = useState("");
   const [email2, setEmail2] = useState("");

   const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_KEY,
      dangerouslyAllowBrowser: true,
   });

   const handleGPT = async (e) => {
      e.preventDefault();
      const info = JSON.stringify(formdata.values);
      console.log(info);

      const msg1 = [
         ...baseMsg,
         {
            role: "user",
            content: prompt1p1 + info + "\n" + prompt1p2,
         },
      ];
      const msg2 = [
         ...baseMsg,
         {
            role: "user",
            content: prompt2 + info,
         },
      ];

      // console.log(msg1);
      // console.log(msg2);
      const res1 = await openai.chat.completions.create({
         messages: msg1,
         model: "gpt-3.5-turbo",
      });
      const res2 = await openai.chat.completions.create({
         messages: msg2,
         model: "gpt-3.5-turbo",
      });
      // console.log(res1);
      // console.log(res2);

      setEmail1(res1.choices[0].message.content);
      setEmail2(res2.choices[0].message.content);
   };

   return (
      <Container size={1400}>
         <Title my={40}>Tell us about your business!</Title>
         <form
            onSubmit={(e) => handleGPT(e)}
            className={"flex flex-col gap-y-4"}
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
            <Select
               label={"Framework for Email"}
               maw={500}
               data={[
                  { label: "Chris Ritson Framework", value: framework1 },
                  { label: "Chistian Krause framework", value: framework2 },
               ]}
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
            <Button
               w={150}
               type={"submit"}
            >
               Generate Email
            </Button>
         </form>
         <Divider
            size={2}
            my={32}
         />
         <Flex direction={"column"}>
            <Flex
               direction={"row"}
               justify={"space-between"}
               columnGap={8}
            >
               <Text size={"xl"}>Sample 1</Text>
               <CopyButton value={email1}>
                  {({ copied, copy }) => (
                     <Button
                        onClick={copy}
                        color={copied ? "teal" : "blue"}
                        disabled={email1.length == 0}
                     >
                        {copied ? "Email Copied" : "Copy Email"}
                     </Button>
                  )}
               </CopyButton>
            </Flex>
            <Text
               style={{ whiteSpace: "pre-wrap" }}
               maw={"100vw"}
               className={
                  " border-2 border-gray-300 border-solid rounded-md p-4 my-4"
               }
            >
               {email1}
            </Text>
            <Flex
               direction={"row"}
               justify={"space-between"}
               columnGap={8}
            >
               <Text size={"xl"}>Sample 2</Text>
               <CopyButton value={email2}>
                  {({ copied, copy }) => (
                     <Button
                        onClick={copy}
                        color={copied ? "teal" : "blue"}
                        disabled={email2.length == 0}
                     >
                        {copied ? "Email Copied" : "Copy Email"}
                     </Button>
                  )}
               </CopyButton>
            </Flex>
            <Text
               style={{ whiteSpace: "pre-wrap" }}
               maw={"100vw"}
               className={
                  " border-2 border-gray-300 border-solid rounded-md p-4 my-4"
               }
            >
               {email2}
            </Text>
         </Flex>
         <Box h={80}></Box>
      </Container>
   );
}
