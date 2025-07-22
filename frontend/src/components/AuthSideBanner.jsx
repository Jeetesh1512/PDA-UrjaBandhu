"use client";

export default function AuthSideBanner() {
  return (
    <div className="hidden lg:flex w-2/3 bg-[url(/home-bg.jpg)] bg-cover bg-center bg-no-repeat text-white p-10 items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-xl max-w-sm">
        <p className="mb-4">
          Because power is more than electricity — it's comfort, safety, and
          community. We're here to protect it, together.
        </p>

        <div className="flex flex-row gap-6">
          <img
            src="/owner-profile.jpeg"
            alt="profile"
            className="h-18 w-15 rounded-4xl"
          />
          <div className="flex justify-center flex-col">
            <p className="text-sm font-semibold">RAHUL NAIR</p>
            <p className="text-xs text-gray-400">POWER INFRASTRUCTURE LEAD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
