import { useCallback, useEffect, useState } from "react";
import type { DataUsers } from "../interfaces/users/Users.Interfaces";
import { UserService } from "../services/api/User.service";


export const useUsersService = () => {

    const [users, setUsers] = useState<DataUsers[]>([]);

    const userService = new UserService();

    const getUsers = useCallback(async () => {
        try {
            const response = await userService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    useEffect(() => {
        getUsers();
    }, [getUsers]);


    return {
        users,
    }
}