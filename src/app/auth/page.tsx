import { redirect } from "next/navigation";

export default function AuthIndexRedirect() {
  redirect("/login");
}
