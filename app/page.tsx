import { UserButton, auth } from "@clerk/nextjs";

export default function Home() {
  const { userId }: { userId: string | null } = auth();
  console.log(userId);
  return (
    <div>
      hii <p>hii</p>
      <UserButton />
      <p>{userId}</p>
    </div>
  );
}
