import { RouterProvider } from "react-router";
import { router } from "./routes";
import { BookmarksProvider } from "./context/BookmarksContext";

export default function App() {
  return (
    <BookmarksProvider>
      <RouterProvider router={router} />
    </BookmarksProvider>
  );
}
