import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios from "axios";
import { ILogin, ILoginSuccess } from "@/lib/types/ILogin";
import { useNavigate } from "react-router-dom";
import { Loader } from 'lucide-react';

const loginSchema = yup.object().shape({
  username: yup.string().email("Invalid username").required("Required"),
  passcode: yup.string().required("Required")
});

export default function Login() {
  const navigate = useNavigate();
  const [current, setCurrent] = React.useState<string>("login");
  const onClickForgotPassword = () => setCurrent("forgotPassword");
  const onclickLogin = () => setCurrent("login");
  const loginForm = useForm({ resolver: yupResolver(loginSchema) });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const submit: SubmitHandler<ILogin> = async (values) => {
    if (error) setError(null);
    setLoading(true);
    const options = {
      method: "POST",
      url: "auth/login",
      data: values
    }
    try {
      const res = await axios.request(options);
      console.log(res);
      if(res.status === 200) {
        const loginData: ILoginSuccess = res.data;
        sessionStorage.setItem('command', loginData.data.accessToken);
        sessionStorage.setItem('exp', loginData.data.expirationDate);
        sessionStorage.setItem('user', loginData.data.user);
        console.log(loginData);
        // navigate({ pathname: "/vendor" });
        navigate("/vendor");
        console.log('navigate here')
        setLoading(false);
        return;
      }
      setLoading(false);
      setError("Unable to login at this time, please try again later");
    } catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const err = error as { response: { data: { message: string; } } };
        setError(err.response.data.message);
        return;
      }
      setError("An error has occurred on the server");
    }
  }

  return (
    <section className="h-screen w-full grid place-items-center p-4">
      <Card className="w-full max-w-[320px] h-[440px] grid place-items-center relative overflow-hidden rounded-none shadow-none border-none">
        <Card className={cn(
          "max-h-[440px] w-full shadow-lg",
          current === "forgotPassword" ? "opacity-0 invisible transition-all duration-1000" : "opacity-100 visible transition-all duration-1000"
        )}>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(submit)}>
                <div className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="passcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-red-600">{error}</p>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? <span className="animate-spin"><Loader /></span> : "Login"}
                  </Button>
                  <div className="text-center">
                    <button type="button" className="text-center text-sm cursor-pointer" onClick={onClickForgotPassword}>Forgot password?</button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>

        <Card className={cn(
          "h-[240px] absolute w-full",
          current === "forgotPassword" ? "translate-y-0 opaci-100 transition-transform duration-1000" : "translate-y-[150%] opacity-0 transition-all duration-1000"
        )}>
          <CardHeader>
            <CardTitle>Forgot password</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Username" className="mb-2" />
            <Button className="w-full mt-2">Get OTP</Button>
          </CardContent>
          <CardFooter className="justify-center">
            <button onClick={onclickLogin} className="text-sm">Back to Login</button>
          </CardFooter>
        </Card>
      </Card>
    </section>
  )
}
