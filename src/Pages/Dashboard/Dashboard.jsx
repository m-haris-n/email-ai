import {
   Button,
   Code,
   Flex,
   NumberInput,
   TextInput,
   Title,
   Tabs,
   Modal,
   Text,
   Textarea,
   Loader,
   Container,
   Checkbox,
} from "@mantine/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iframecode } from "../../../dummydata";
import { useDisclosure } from "@mantine/hooks";
import { CodeHighlight } from "@mantine/code-highlight";
import { useForm } from "@mantine/form";
import { createTurns } from "../../api/turnsHandler";
import {
   createField,
   deleteField,
   editField,
   getAllFields,
} from "../../api/fieldHandlers";
import {
   createFramework,
   deleteFramework,
   getAllFrameworks,
} from "../../api/frameworkHandlers";
import EditFwForm from "./components/EditFwForm";

export default function Dashboard() {
   //Hooks

   const [turns, setTurns] = useState(5);
   const [invalidate, setInvalidate] = useState(0);
   const [isEditableObj, setIsEditableObj] = useState([]);
   const [frameworks, setFrameworks] = useState([]);
   const [turnsSucc, setTurnsSucc] = useState(false);

   const [delLoaders, setDelLoaders] = useState({});
   const [saveLoaders, setSaveLoaders] = useState({});
   const [turnsLoading, setTurnsLoading] = useState(false);
   const [addFieldLoading, setAddFieldLoading] = useState(false);

   const [turnsErr, setTurnsErr] = useState(false);
   const [addFieldErr, setAddFieldErr] = useState(false);
   const [changeFieldErr, setChangeFieldErr] = useState(false);

   const [editFw, setEditFw] = useState(false);

   const nav = useNavigate();
   const [opened, { open, close }] = useDisclosure();

   const frameworkForm = useForm({
      initialValues: {
         frameworkName: "",
         framework: ``,
      },
   });

   const addFldFrm = useForm({
      initialValues: {
         fieldName: "",
         isRequired: false,
      },
   });

   //Handlers

   const handleAddField = (vals) => {
      setAddFieldLoading(true);
      setAddFieldErr(false);
      console.log(vals);
      createField(vals)
         .then((res) => {
            console.log(res);
            addFldFrm.reset();
            setInvalidate(invalidate + 1);
            setAddFieldLoading(false);
         })
         .catch((err) => {
            setAddFieldLoading(false);
            console.log(err);
            setAddFieldErr(true);
         });
   };

   const handleDeleteFiend = (e, id) => {
      e.preventDefault();
      setChangeFieldErr(false);
      console.log("deleting", id);
      setDelLoaders({ ...delLoaders, [id]: true });

      deleteField(id)
         .then((res) => {
            console.log(res);
            setInvalidate(invalidate + 1);
            setDelLoaders({ ...delLoaders, [id]: false });
         })
         .then((err) => {
            setDelLoaders({ ...delLoaders, [id]: false });
            if (err) {
               setChangeFieldErr(true);
               console.log("err:", err);
            }
         });
   };

   const handleUpdateField = (e) => {
      setChangeFieldErr(false);
      e.preventDefault();
      const id = e.currentTarget.value;
      var allObjs = structuredClone(isEditableObj);

      var idx = allObjs.findIndex((obj) => {
         return obj.id == id;
      });

      setSaveLoaders({ ...saveLoaders, [id]: true });

      const obj = allObjs[idx];
      editField(obj.id, {
         fieldName: obj.labelName,
         isRequired: obj.isRequired,
      })
         .then((res) => {
            console.log(res);
            setInvalidate(invalidate + 1);
            handleEdit(e);
            setSaveLoaders({ ...saveLoaders, [id]: true });
         })
         .catch((err) => {
            setSaveLoaders({ ...saveLoaders, [id]: true });

            if (err == null) {
               setChangeFieldErr(true);
               console.log("err:");
               console.log("err:", err);
            }
         });
   };

   const handleCreateFramework = (vals) => {
      createFramework(vals)
         .then((res) => {
            console.log(res);
            frameworkForm.reset();
            setInvalidate(invalidate + 1);
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleDeleteFramework = (e) => {
      e.preventDefault();
      deleteFramework(e.currentTarget.value)
         .then((res) => {
            console.log(res);
            setInvalidate(invalidate + 1);
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleViewFwEditForm = (e) => {
      e.preventDefault();
      setEditFw(!editFw);
   };

   const handleLogout = () => {
      localStorage.clear();
      nav("/login");
   };

   const handleFieldChange = (e, key) => {
      e.preventDefault();

      const id = key;
      console.log("id", id);
      var allObjs = structuredClone(isEditableObj);

      var idx = allObjs.findIndex((obj) => {
         return obj.id == id;
      });
      console.log(idx);
      console.log(allObjs[idx]);
      allObjs[idx].labelName = e.currentTarget.value;
      setIsEditableObj([...allObjs]);
   };

   const handleCheckChange = (e, key) => {
      const id = key;
      console.log("id", id);
      var allObjs = structuredClone(isEditableObj);

      var idx = allObjs.findIndex((obj) => {
         return obj.id == id;
      });
      console.log("idx", idx);
      console.log("obj", allObjs[idx]);

      console.log("checked:", e.currentTarget.checked);
      allObjs[idx].isRequired = e.currentTarget.checked;
      setIsEditableObj([...allObjs]);
   };

   const handleEdit = (e) => {
      e.preventDefault();

      const id = e.currentTarget.value;
      var allObjs = structuredClone(isEditableObj);

      var idx = allObjs.findIndex((obj) => {
         return obj.id == id;
      });
      console.log(idx);

      if (allObjs[idx].isEditable == false) {
         allObjs[idx].isEditable = true;
         setIsEditableObj([...allObjs]);
      } else {
         allObjs[idx].isEditable = false;
         setIsEditableObj([...allObjs]);
      }
   };

   const handleSetTurns = (e) => {
      e.preventDefault();
      setTurnsLoading(true);
      setTurnsErr(false);
      setTurnsSucc(false);
      console.log(turns);
      createTurns({ turns: turns })
         .then((res) => {
            console.log(res);
            setTurnsSucc(true);
            setTurnsLoading(false);
         })
         .catch((err) => {
            console.log(err);
            setTurnsErr(true);
            setTurnsLoading(false);
         });
   };

   // Side Effects

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
         nav("/login");
      }
   }, []);

   useEffect(() => {
      getAllFields().then((res) => {
         let temparr = [];
         let delLoads = {};
         for (let field of res.data.fields) {
            delLoads[field._id] = false;
            let temp = {
               id: field._id,
               isEditable: false,
               labelName: field.fieldName,
               isRequired: field.isRequired,
            };
            temparr.push(temp);
         }
         setIsEditableObj(temparr);
         setDelLoaders(delLoads);
         setSaveLoaders(delLoads);
         console.log("mainobj", temparr);
      });
      getAllFrameworks().then((res) => {
         const fws = res.data.frameworks;
         let temparr = [];
         for (let fw of fws) {
            let temp = {
               id: fw._id,
               label: fw.frameworkName,
               value: fw.framework,
            };
            temparr.push(temp);
         }
         setFrameworks(temparr);
      });
   }, [invalidate]);

   // Dynamic Components

   let currentFields =
      Object.keys(isEditableObj).length > 0
         ? isEditableObj.map((field) => (
              <form key={field.id}>
                 <Flex
                    direction={"row"}
                    gap={16}
                    id={1}
                    key={field.id}
                    align={"center"}
                 >
                    <TextInput
                       readOnly={!field.isEditable}
                       value={field.labelName}
                       onChange={(e) => handleFieldChange(e, field.id)}
                       w={300}
                    />
                    <Checkbox
                       label={"Is required"}
                       checked={field.isRequired}
                       disabled={!field.isEditable}
                       onChange={(e) => handleCheckChange(e, field.id)}
                    />
                    <Button
                       variant={"outline"}
                       value={field.id}
                       w={80}
                       onClick={
                          field.isEditable
                             ? (e) => handleUpdateField(e)
                             : (e) => handleEdit(e)
                       }
                    >
                       {field.isEditable ? (
                          saveLoaders[field.id] ? (
                             <Loader
                                size={"sm"}
                                color={"blue"}
                             />
                          ) : (
                             "Save"
                          )
                       ) : (
                          "Edit"
                       )}
                    </Button>
                    <Button
                       color={"red"}
                       value={field.id}
                       w={80}
                       onClick={
                          !field.isEditable
                             ? (e) => handleDeleteFiend(e, field.id)
                             : (e) => {
                                  handleEdit(e);
                               }
                       }
                    >
                       {!field.isEditable ? (
                          delLoaders[field.id] ? (
                             <Loader
                                size={"sm"}
                                color={"white"}
                             />
                          ) : (
                             "Delete"
                          )
                       ) : (
                          "Cancel"
                       )}
                    </Button>
                 </Flex>
              </form>
           ))
         : null;

   const tabsTab =
      Object.keys(frameworks).length == 0
         ? null
         : frameworks.map((tab) => (
              <Tabs.Tab
                 key={tab.id}
                 value={tab.label}
              >
                 {tab.label}
              </Tabs.Tab>
           ));
   const tabsPanel =
      Object.keys(frameworks).length == 0
         ? null
         : frameworks.map((tab) => (
              <Tabs.Panel
                 key={tab.id}
                 value={tab.label}
              >
                 <Text
                    className={"whitespace-pre-wrap"}
                    my={16}
                 >
                    {tab.value}
                 </Text>
                 <Button onClick={(e) => handleViewFwEditForm(e)}>
                    {editFw ? "Cancel" : "Edit"}
                 </Button>
                 <Button
                    value={tab.id}
                    color={"red"}
                    mx={16}
                    onClick={(e) => handleDeleteFramework(e)}
                 >
                    Delete
                 </Button>
                 {editFw && (
                    <EditFwForm
                       id={tab.id}
                       fw={tab.value}
                       fwName={tab.label}
                       invalidate={invalidate}
                       setInvalidate={setInvalidate}
                       editFw={editFw}
                       setEditFw={setEditFw}
                    />
                 )}
              </Tabs.Panel>
           ));

   //Logs

   return (
      <>
         <Modal
            centered={true}
            opened={opened}
            onClose={close}
            size={"xl"}
         >
            <Modal.Body>
               <Tabs defaultValue={frameworks[0] ? frameworks[0].label : ""}>
                  <Tabs.List>{tabsTab}</Tabs.List>
                  {tabsPanel}
               </Tabs>
            </Modal.Body>
         </Modal>
         <Container size={1400}>
            <Flex
               direction={"row"}
               justify={"space-between"}
               align={"center"}
               py={16}
            >
               <Title>Dashboard</Title>

               <Button
                  className={"float-right"}
                  onClick={handleLogout}
               >
                  Log out
               </Button>
            </Flex>
            <Title
               order={2}
               my={12}
            >
               Code for Embedding
            </Title>
            <CodeHighlight
               language={"html"}
               code={iframecode}
               maw={600}
               bg={"gray.2"}
               p={12}
               className={"rounded-md"}
            />
            <br />
            <Title
               order={2}
               my={12}
            >
               Set Turns for Users
            </Title>
            <Flex
               direction={"row"}
               justify={"flex-start"}
               align={"end"}
               columnGap={16}
            >
               <NumberInput
                  value={turns}
                  onChange={setTurns}
                  label={"Limit per user"}
                  defaultValue={5}
               />
               <Button onClick={(e) => handleSetTurns(e)}>
                  {turnsLoading ? <Loader size={"sm"} /> : "Set"}
               </Button>
            </Flex>
            {turnsErr && <Text color={"red"}>Something went wrong</Text>}
            {turnsSucc && <Text color={"blue"}>Turns updated</Text>}

            <Title
               my={12}
               order={2}
            >
               Fields
            </Title>
            <Flex
               direction={"column"}
               gap={16}
            >
               <form
                  onSubmit={addFldFrm.onSubmit((vals) => handleAddField(vals))}
                  className={"flex flex-row gap-4 items-end justify-start"}
               >
                  <TextInput
                     label={"Field Name"}
                     required={true}
                     w={300}
                     {...addFldFrm.getInputProps("fieldName")}
                  />
                  <Checkbox
                     my={8}
                     label={"Is required"}
                     {...addFldFrm.getInputProps("isRequired")}
                  />
                  <Button type={"submit"}>
                     {addFieldLoading ? (
                        <Loader
                           color={"white"}
                           size={"sm"}
                        />
                     ) : (
                        "Add"
                     )}
                  </Button>
               </form>
               {addFieldErr && (
                  <Text c={"red"}>
                     Something went wrong when adding the field!
                  </Text>
               )}
               <Title order={3}>Current Fields</Title>
               {changeFieldErr && (
                  <Text c={"red"}>
                     Something went wrong when trying to change fields!
                  </Text>
               )}

               {currentFields}
            </Flex>
            <br />
            <Title
               order={2}
               my={12}
            >
               Frameworks
            </Title>
            <Button
               onClick={open}
               mb={12}
            >
               View current frameworks
            </Button>
            <form
               onSubmit={frameworkForm.onSubmit((vals) =>
                  handleCreateFramework(vals)
               )}
            >
               <TextInput
                  label={"Framwork Name"}
                  w={500}
                  required
                  {...frameworkForm.getInputProps("frameworkName")}
               />
               <Textarea
                  label={"Framework"}
                  rows={10}
                  w={500}
                  required
                  {...frameworkForm.getInputProps("framework")}
               />
               <Button
                  type={"submit"}
                  my={16}
               >
                  Add
               </Button>
            </form>
            {/* <Title my={24}>Prompts</Title> */}
         </Container>
         <footer
            className={
               " w-full h-16 bg-slate-100 mt-6 flex flex-row justify-center items-center"
            }
         >
            <Text>Developed by m-haris-n</Text>
         </footer>
      </>
   );
}
