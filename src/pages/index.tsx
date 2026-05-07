import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Scene from "@/components/Scene";
import SpinningCube from "@/components/SpinningCube";
import Primitives1 from "@/components/Primitives1";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} bg-zinc-50 font-sans`}
    >

      <main>
        <h1 className="text-3xl text-black">ThreeJS</h1>

        {/* <div className="w-full h-[500px] flex items-center justify-center">
          <div className="w-[calc(100%-100px)]">
            <Scene />
          </div>
        </div> */}
        <Scene />
        {/* <SpinningCube /> */}
        {/* <Primitives1 /> */}
      </main>

    </div>
  );
}
