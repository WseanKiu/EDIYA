import Image from "next/image";
import Hello from "../components/hello";

export default function Home() {
  console.log("what am I doing here?");
  return (
    <>
      <h1 className="text-3xl">Welcome to Next JS!</h1>
      <Hello />
    </>
  );
}
