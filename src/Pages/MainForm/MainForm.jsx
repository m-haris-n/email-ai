import {
   Box,
   Button,
   Checkbox,
   Container,
   CopyButton,
   Divider,
   Flex,
   Group,
   Loader,
   Modal,
   Select,
   Tabs,
   Text,
   TextInput,
   Textarea,
   Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import OpenAI from "openai";
import React, { useEffect, useState } from "react";

import { getAllFields } from "../../api/fieldHandlers";
import { getAllFrameworks } from "../../api/frameworkHandlers";
import { getLatestTurns } from "../../api/turnsHandler";

const generatePrompts = (data, framework) => {
   const prompt1 = `
   Write a cold email to a prospect, below is the details for the cold email:
   Product the company is trying to promote: ${data.descriptionOfProduct}
   Problem the product/service solves: ${data.problemTheProductSolves}
   Unique selling point of the product/service: ${data.uniqueSellingPoint}
   Company we are sending to: ${data.targetCompany}
   Company domain: ${data.targetCompanyDomain}
   Key finding about the company: ${data.targetCompanyKeyFindings}
   Decision maker name we are sending to: ${data.targetDecisionMaker}
   Key finding about the decision maker: ${data.targetDdecisionMakerKeyFindings}
   Subject line idea: ${data.subjectLine}
   Message idea: ${data.messageIdea}
   Tone of message: ${data.toneOfMessage}
   Goal of the message: ${data.goalOfEmail}
   Message templace:
   "
   ${framework}
   "
   \nEach sentence should have max 9 words so that it is easy to use. The language should be such that even 6th grader would understand what is talked about.
   `;
   const prompt2 = `
   You are an professional cold email copywriter. Write the best email that you think will get most discussions opened based on this specification. Use the data below:
   Product the company is trying to promote: ${data.descriptionOfProduct}
   Problem the product/service solves: ${data.problemTheProductSolves}
   Unique selling point of the product/service: ${data.uniqueSellingPoint}
   Company we are sending to: ${data.targetCompany}
   Company domain: ${data.targetCompanyDomain}
   Key finding about the company: ${data.targetCompanyKeyFindings}
   Decision maker name we are sending to: ${data.targetDecisionMaker}
   Key finding about the decision maker: ${data.targetDdecisionMakerKeyFindings}
   Subject line idea: ${data.subjectLine}
   Message idea: ${data.messageIdea}
   Tone of message: ${data.toneOfMessage}
   Goal of the message: ${data.goalOfEmail}
   Message templace:
   "
   ${framework}
   "
   `;
   return [prompt1, prompt2];
};

const generatePromptDynamic = (data, framework, fields) => {
   const promptdata = fields.map((field) => {
      return `
      ${field.fieldName}: ${data[field.fieldValue]}`;
   });
   const prompt1 = `
   Write a cold email to a prospect, below is the details for the cold email:
   ${promptdata}
   Message template:
   "
   ${framework}
   "
   \nEach sentence should have max 9 words so that it is easy to use . The language should be such that even 6th grader would understand what is talked about.
   `;

   const prompt2 = `
   You are an professional cold email copywriter. Write the best email that you think will get most discussions opened based on this specification. Use the data below:
   ${promptdata}
   Message template:
   "
   ${framework}
   "
   `;

   return [prompt1, prompt2];
};

// const frameworks = [
//    { label: "Chris Ritson Framework", value: framework1 },
//    { label: "Chistian Krause framework", value: framework2 },
// ];

export default function MainForm() {
   // states and hooks
   const initVals = {};
   const [pageLoading, setPageLoading] = useState(true);
   const [email1, setEmail1] = useState("");
   const [email2, setEmail2] = useState("");

   const [email1load, setEmail1load] = useState(false);
   const [email2load, setEmail2load] = useState(false);
   const [turns, setTurns] = useState(0);

   const [fields, setFields] = useState([]);
   const [frameworks, setFrameworks] = useState([]);

   for (let obj of fields) {
      initVals[obj.fieldValue] = "";
   }

   const [opened, { open, close }] = useDisclosure();

   const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_KEY,
      dangerouslyAllowBrowser: true,
   });

   const form = useForm({
      initialValues: { ...initVals, frameworkOfEmail: "" },
   });

   //effects

   useEffect(() => {
      getPageData().then(() => {
         setPageLoading(false);
      });
   }, []);

   //handlers

   const getPageData = async () => {
      const resField = await getAllFields();
      const resFw = await getAllFrameworks();
      const resTurns = await getLatestTurns();

      console.log("turns", resTurns.data);
      console.log("turnsval", resTurns.data.turns);
      console.log("turnsvalother", resTurns.data["turns"]);
      let currCreatedAt = localStorage.getItem("createdAt");
      let currTurns = localStorage.getItem("turns");
      if (
         currCreatedAt == null ||
         Date.parse(resTurns.data.createdAt) > Date.parse(currCreatedAt)
      ) {
         setTurns(toString(resTurns.data.turns));
         localStorage.setItem("turns", toString(resTurns.data.turns));
         localStorage.setItem("createdAt", toString(resTurns.data.createdAt));
      } else {
         setTurns(currTurns);
      }

      setFields(resField.data.fields);

      let frames = resFw.data.frameworks;
      // console.log("frameworks", frames);
      let frameworkData = [];
      for (let frm of frames) {
         frameworkData.push({
            label: frm.frameworkName,
            value: frm.framework,
         });
      }
      setFrameworks(frameworkData);
   };

   const handleGPT = (e) => {
      e.preventDefault();

      let currTurns = localStorage.getItem("turns");
      let currCreatedAt = Date.parse(localStorage.getItem("createdAt"));
      getLatestTurns().then((res) => {
         let latestTurns = res.data.turns;
         let latestcreatedAt = Date.parse(res.data.createdAt);
         if (latestcreatedAt > currCreatedAt) {
            localStorage.setItem("turns", toString(resTurns.data.turns));
            localStorage.setItem(
               "createdAt",
               toString(resTurns.data.createdAt)
            );
            currTurns = latestTurns;
            currCreatedAt = latestcreatedAt;
         }
         if (currTurns == 0) {
            return;
         }
         setTurns(toString(localStorage.getItem("turns") - 1));
         localStorage.setItem(
            "turns",
            toString(localStorage.getItem("turns") - 1)
         );
         const [prompt1, prompt2] = generatePromptDynamic(
            form.values,
            form.values.frameworkOfEmail,
            fields
         );
         setEmail1load(true);
         setEmail2load(true);

         const msg1 = [
            {
               role: "user",
               content: prompt1,
            },
         ];
         const msg2 = [
            {
               role: "user",
               content: prompt2,
            },
         ];

         openai.chat.completions
            .create({
               messages: msg1,
               model: "gpt-3.5-turbo",
            })
            .then((res1) => {
               setEmail1load(false);
               setEmail1(res1.choices[0].message.content);
            });
         openai.chat.completions
            .create({
               messages: msg2,
               model: "gpt-3.5-turbo",
            })
            .then((res2) => {
               setEmail2load(false);
               setEmail2(res2.choices[0].message.content);
            });
      });
   };

   //dynamic components

   const inputs = fields.map((obj) => (
      <TextInput
         key={obj._id}
         label={obj.fieldName}
         {...form.getInputProps(obj.fieldValue)}
         required={obj.isRequired}
         maw={"100%"}
         w={"500"}
      />
   ));

   const tabsTab = frameworks.map((tab) => (
      <Tabs.Tab
         key={tab.label}
         value={tab.label}
      >
         {tab.label}
      </Tabs.Tab>
   ));
   const tabsPanel = frameworks.map((tab) => (
      <Tabs.Panel
         p={16}
         key={tab.label}
         value={tab.label}
      >
         <Text className={"whitespace-pre-wrap"}>{tab.value}</Text>
      </Tabs.Panel>
   ));

   //logs

   return (
      <>
         {pageLoading && (
            <Flex
               justify={"center"}
               align={"center"}
               w={"100%"}
               h={"100vh"}
            >
               <Loader size={"xl"} />
            </Flex>
         )}
         {frameworks.length > 0 && (
            <Modal
               opened={opened}
               onClose={close}
               size={"lg"}
            >
               <Modal.Body>
                  <Tabs defaultValue={frameworks[0].label}>
                     <Tabs.List>{tabsTab}</Tabs.List>
                     {tabsPanel}
                  </Tabs>
               </Modal.Body>
            </Modal>
         )}
         {!pageLoading && (
            <Container size={1400}>
               <Title my={40}>Tell us about your business!</Title>
               <div className={"flex flex-col lg:flex-row gap-8"}>
                  <form
                     onSubmit={(e) => handleGPT(e)}
                     className={"flex flex-col gap-y-4"}
                  >
                     {inputs}
                     <Select
                        label={"Framework for Email"}
                        maw={500}
                        data={frameworks}
                        required={true}
                        disabled={false}
                        {...form.getInputProps("frameworkOfEmail")}
                     />
                     <Button
                        onClick={open}
                        w={200}
                        variant={"outline"}
                     >
                        Preview Frameworks
                     </Button>
                     <div
                        className={
                           "flex flex-row gap-x-4 justify-start items-center"
                        }
                     >
                        <Button
                           w={150}
                           type={"submit"}
                           disabled={turns == 0 ? true : false}
                        >
                           Generate Email
                        </Button>
                        <Text>
                           <strong>{turns}</strong> free turns left!
                        </Text>
                     </div>
                  </form>
                  <Flex
                     direction={"column"}
                     w={"100%"}
                  >
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
                        w={"100%"}
                        mih={50}
                        className={
                           " border-2 border-gray-300 border-solid rounded-md p-4 my-4"
                        }
                     >
                        {email1load ? <Loader /> : email1}
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
                        w={"100%"}
                        mih={50}
                        className={
                           " border-2 border-gray-300 border-solid rounded-md p-4 my-4"
                        }
                     >
                        {email2load ? <Loader /> : email2}
                     </Text>
                  </Flex>
               </div>

               <Box h={80}></Box>
            </Container>
         )}
      </>
   );
}
