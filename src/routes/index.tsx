import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Evara3D — Run it. Frame it." },
      { name: "description", content: "Custom 3D-printed topographic relief maps of your Strava runs, framed and ready to hang. Designed and made in the UAE." },
      { property: "og:title", content: "Evara3D — Run it. Frame it." },
      { property: "og:description", content: "Custom 3D-printed topographic relief maps of your Strava runs, framed and ready to hang." },
    ],
  }),
  component: Home,
});

function Home() {
  return <></>;
}
