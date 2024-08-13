import React from "react";
import DBLayout from "@components/Dashboard/DBLayout";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { IManufacturerResponse } from "@/lib/types/IManufacturer";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { Loader } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ManufacturersList from "@/components/Dashboard/Manufacturers/ManufacturerList";
import ManufacturerLoading from "@/components/Dashboard/Manufacturers/ManufacturerLoading";

interface INewManufacturer {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Manufacturer name is required')
});

export function Manufacturers() {
  const { toast } = useToast()
  const [page,] = React.useState(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const token = sessionStorage.getItem('command');

  const manufacturerForm = useForm({ resolver: yupResolver(schema) })

  const manufacturers = useQuery({
    queryKey: ['manufacturers', page],
    queryFn: async () => {
      const options: AxiosRequestConfig = {
        url: "products/manufacturer/list",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const res = await axios.request(options);
      const data: IManufacturerResponse = res.data;
      return data;
    },
    placeholderData: keepPreviousData,
    refetchInterval: 30000
  });

  const submit: SubmitHandler<INewManufacturer> = async (values) => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "products/manufacturer/new",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        manufacturerName: values.name
      }
    }
    try {
      const res = await axios.request(options);
      if (res.status === 200) {
        manufacturers.refetch();
        setLoading(false);
        setOpen(false);
        manufacturerForm.reset();
        toast({
          title: "Success",
          description: "Manufacturer created successfully"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error " + res.status,
          description: "There was a problem completing your request, please try again later."
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "An error has occurred on the server, please try again after sometime."
      });
    }
  }

  return (
    <DBLayout>
      <section className="w-full">
        <div className="p-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-700">Manufacturers</h1>
              <AlertDialog open={open}>
                <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
                  <Button>New</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>New Manufacturer</AlertDialogTitle>
                    <AlertDialogDescription>
                      Adds a new manufacturer item
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Form {...manufacturerForm}>
                    <form onSubmit={manufacturerForm.handleSubmit(submit)} className="mt-4">
                      <FormField
                        control={manufacturerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturer Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter manufacturer's name" autoFocus {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <AlertDialogFooter className="mt-8">
                        <AlertDialogAction type="submit" disabled={loading} className="w-full">{loading ? <span className="animate-spin"><Loader /></span> : "Save"}</AlertDialogAction>
                        <AlertDialogCancel disabled={loading} className="w-full" onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </form>
                  </Form>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Separator className="my-4" />
          </div>
          <React.Fragment>
            {manufacturers.isLoading && <ManufacturerLoading />}
          </React.Fragment>
          <React.Fragment>
            {
              (manufacturers.isError) && (
                <div className="p-4">
                  <p className="text-red-600 text-wrap break-words">{JSON.stringify(manufacturers.error, null, 2)}</p>
                </div>
              )
            }
          </React.Fragment>
          <React.Fragment>
            {
              (!manufacturers.isError && manufacturers.data && manufacturers.data.success) && <ManufacturersList refetch={manufacturers.refetch} data={manufacturers.data.data} />
            }
          </React.Fragment>
        </div>
      </section>
    </DBLayout>
  )
}
