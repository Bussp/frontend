import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User, UserCreateAccountRequest } from "../models/users.types";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../requests/users";
import { queryKeys } from "./queryClient";

/**
 * Hook for fetching the current authenticated user.
 *
 * @param options - Additional query options
 * @returns Query result with user data
 *
 * @example
 * ```tsx
 * const { data: user, isLoading } = useCurrentUser();
 *
 * if (isLoading) return <Spinner />;
 * return <Text>Welcome, {user?.name}</Text>;
 * ```
 */
export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: getCurrentUser,
    ...options,
  });
}

/**
 * Hook for user registration.
 *
 * @returns Mutation for creating a new user account
 *
 * @example
 * ```tsx
 * const { mutate: register, isPending } = useRegister();
 *
 * const handleSubmit = () => {
 *   register({ name: "John", email: "john@example.com", password: "secret" });
 * };
 * ```
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserCreateAccountRequest) => registerUser(payload),
    onSuccess: (user: User) => {
      // pre-populate the user cache after registration
      queryClient.setQueryData(queryKeys.users.me(), user);
    },
  });
}

/**
 * Hook for user login.
 *
 * @returns Mutation for authenticating a user
 *
 * @example
 * ```tsx
 * const { mutate: login, isPending } = useLogin();
 *
 * const handleLogin = () => {
 *   login(
 *     { email: "john@example.com", password: "secret" },
 *     {
 *       onSuccess: () => navigation.navigate("Home"),
 *       onError: (error) => showError(error.message),
 *     }
 *   );
 * };
 * ```
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: () => {
      // Invalidate and refetch user data after login
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
    },
  });
}

/**
 * Hook for user logout.
 *
 * @returns Mutation for logging out the current user
 *
 * @example
 * ```tsx
 * const { mutate: logout } = useLogout();
 *
 * const handleLogout = () => {
 *   logout(undefined, {
 *     onSuccess: () => navigation.navigate("Login"),
 *   });
 * };
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      logoutUser();
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
}
