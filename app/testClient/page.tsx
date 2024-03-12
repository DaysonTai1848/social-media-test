"use client";
import React, { useRef, useState } from "react";

import createClerkSupabaseClient from "@/utils/clerkSupabaseClient";

const page = () => {
  // const client = createClerkSupabaseClient();
  // const { data, error } = await client.from("post").select();
  // console.log(data);
  // return (
  //   <div>
  //     <p>test clerk supabase client</p>
  //     <p>{JSON.stringify(data)}</p>
  //   </div>
  // );
  const client = createClerkSupabaseClient();
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
        authentication.
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
};

export default page;
