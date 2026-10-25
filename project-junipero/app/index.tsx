import { Redirect } from "expo-router";
import { useAppStore } from "../src/store/AppStore";

export default function Index() {
  const { session, ready } = useAppStore();
  if (!ready) return null;
  return <Redirect href={session ? "/(app)" : "/(auth)/sign-in"} />;
}
