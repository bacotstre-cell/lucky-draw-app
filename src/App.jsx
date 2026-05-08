import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { InputPage } from "@/pages/InputPage"
import { DrawPage } from "@/pages/DrawPage"
import { GroupPage } from "@/pages/GroupPage"
import { SimultaneousDrawPage } from "@/pages/SimultaneousDrawPage"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const renderPage = () => {
    switch (currentPath) {
      case "/draw":
        return <DrawPage />
      case "/groups":                // <-- baru
        return <GroupPage />
      case "/simultaneous":          // <-- baru
        return <SimultaneousDrawPage />
      case "/":
      default:
        return <InputPage />
    }
  }

  return (
    <>
      <Layout currentPath={currentPath}>
        {renderPage()}
      </Layout>
      <Toaster theme="dark" position="bottom-right" />
    </>
  )
}