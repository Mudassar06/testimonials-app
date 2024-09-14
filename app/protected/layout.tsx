import Navigation from "@/components/header";
import { UserProvider } from "@/components/userDataProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="">
              <Navigation/>
              <div className="">
                <UserProvider>
                {children}
                </UserProvider>
              </div>
          </main>
  );
}
