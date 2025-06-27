import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { PrivateRoute } from "./routes/PrivateRoute";
import ProjectList from "./features/projects/ProjectList";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import { ToastContainer } from "react-toastify";
import { ProjectForm } from "./features/projects/ProjectForm";
import EditProjectPage from "./features/ProjectFormEdit";
import { TaskBoard } from "./components/TaskBoard";
import { TaskForm } from "./components/TaskForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/projects" element={
            <PrivateRoute><ProjectList /></PrivateRoute>
          } />
          <Route
            path="/projects/new"
            element={
              <PrivateRoute>
                <ProjectForm />
              </PrivateRoute>
            }
          />
          <Route path="/projects/:id/edit" element={
            <PrivateRoute>
              <EditProjectPage />
            </PrivateRoute>
          } />
          <Route path="/projects/:id" element={
            <PrivateRoute>
              <TaskBoard />
            </PrivateRoute>
          } />
          <Route path="/projects/:id/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
          <Route path="/projects/:id/tasks/:taskId/edit" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

