import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from "@/components/ui/item";
import { GoBackButton } from "@/components/user/auth/go-back-button";
import { Header } from "@/components/user/auth/header";
import Image from "next/image";

export default function AboutTeam() {
  const members = [
    {
      name: "Jay Vallespin",
      role: "Lead Developer",
      image: "/jay.webp",
    },
    {
      name: "AJ Saco",
      role: "Research and Documentation",
      image: "",
    },
    {
      name: "James Montealto",
      role: "Research and Documentation",
      image: "/james.webp"
    },
  ];

  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="flex-1 flex flex-col gap-4 p-4">
        <GoBackButton />
        <div className="flex flex-col gap-16">
          <div className="w-[800px] flex flex-col gap-8">
            <h1 className="text-7xl font-bold">The minds behind the <span className="text-primary">project.</span></h1>
            <p>A team of three members working together to bring this capstone to life — one focused on software development and two specializing in documentation and research.</p>
          </div>
          <ItemGroup className="grid grid-cols-3 gap-4">
            {members.map((member) => (
              <Item key={member.name} className="p-0">
                <ItemHeader>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={460}
                    height={460}
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                </ItemHeader>
                <ItemContent>
                  <ItemTitle className="text-xl">{member.name}</ItemTitle>
                  <ItemDescription>{member.role}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </div>
    </div>
  );
}
