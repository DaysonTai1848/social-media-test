"use client";
import { useRef, useState } from "react";

// this should be replaced by createBrowserClient from ssr package
import { createClient } from "@supabase/supabase-js";
// import { createBrowserClient } from "@supabase/ssr";

// Add clerk to Window to avoid type errors
declare global {
  interface Window {
    Clerk: any;
  }
}

function createClerkSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "",
    {
      global: {
        // Get the Supabase token with a custom fetch method
        fetch: async (url, options = {}) => {
          const clerkToken = await window.Clerk.session?.getToken({
            template: "supabase",
          });

          // Construct fetch headers
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          // Now call the default fetch
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

const client = createClerkSupabaseClient();

export default function Supabase() {
  const [addresses, setAddresses] = useState<any>();
  const listAddresses = async () => {
    // Fetches all addresses scoped to the user
    // Replace "Addresses" with your table name
    const { data, error } = await client.from("post").select();
    if (!error) setAddresses(data);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const sendAddress = async () => {
    if (!inputRef.current?.value) return;
    await client.from("post").insert({
      // Replace content with whatever field you want
      content: inputRef.current?.value,
    });
    console.log("Address sent");
  };

  return (
    <div className="m-4">
      <p>
        This page is use to test data fetching from supabase with clerk
        authentication
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          onSubmit={sendAddress}
          style={{ color: "black" }}
          type="text"
          ref={inputRef}
          className="border-2 border-black p-2 m-2"
        />
        <button className="border-2 border-black p-2 m-2" onClick={sendAddress}>
          Send Address
        </button>
        <button
          className="border-2 border-black p-2 m-2"
          onClick={listAddresses}
        >
          Fetch Addresses
        </button>
      </div>
      <h2>Addresses</h2>
      {!addresses ? (
        <p>No addresses</p>
      ) : (
        <ul>
          {addresses.map((address: any) => (
            <li key={address.id}>{address.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
