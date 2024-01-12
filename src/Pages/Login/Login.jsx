import {
   TextInput,
   PasswordInput,
   Checkbox,
   Anchor,
   Paper,
   Title,
   Text,
   Container,
   Group,
   Button,
   Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(false);
   const nav = useNavigate();

   const form = useForm({
      initialValues: {
         email: "",
         password: "",
      },
      validate: {
         email: (val) => (val.length > 0 ? null : "field is required"),
         password: (val) => (val.length > 0 ? null : "field is required"),
      },
   });

   const handleLogin = (vals) => {
      setError(false);
      setLoading(true);
      axios
         .post("https://email-ai-backend.vercel.app/api/users/login", {
            email: vals.email,
            password: vals.password,
         })
         .then((res) => {
            // console.log(res);
            setLoading(false);
            localStorage.setItem("token", res.data.accessToken);
            nav("/dashboard");
         })
         .catch((err) => {
            // console.log(err);
            setLoading(false);
            setError(true);
         });
   };

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
         nav("/dashboard");
      }
   }, []);

   return (
      <Container
         size={420}
         my={40}
      >
         <Title ta="center">Welcome back!</Title>
         <Text
            c="dimmed"
            size="sm"
            ta="center"
            mt={5}
         >
            Do not have an account yet?{" "}
            <Anchor
               size="sm"
               component="button"
            >
               Create account
            </Anchor>
         </Text>

         <Paper
            withBorder
            shadow="md"
            p={30}
            mt={30}
            radius="md"
            component={"form"}
            onSubmit={form.onSubmit((vals) => handleLogin(vals))}
         >
            <TextInput
               label="Email"
               placeholder="you@mantine.dev"
               required
               {...form.getInputProps("email")}
            />
            <PasswordInput
               label="Password"
               placeholder="Your password"
               required
               mt="md"
               {...form.getInputProps("password")}
            />
            <Group
               justify="space-between"
               mt="lg"
            >
               <Checkbox label="Remember me" />
               <Anchor
                  component="button"
                  size="sm"
               >
                  Forgot password?
               </Anchor>
            </Group>
            <Button
               fullWidth
               mt="xl"
               type={"submit"}
            >
               {loading ? (
                  <Loader
                     color={"white"}
                     size={"sm"}
                  />
               ) : (
                  "Sign in"
               )}
            </Button>
            {error && <Text color={"red"}>Something went wrong</Text>}
         </Paper>
      </Container>
   );
}
