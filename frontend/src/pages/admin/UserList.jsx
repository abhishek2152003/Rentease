import { useGetUsersQuery } from '../../redux/slices/usersApiSlice';

const UserList = () => {
    const { data: users, isLoading, error } = useGetUsersQuery();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Users Management</h2>
            {isLoading ? (
                <div className="text-zinc-500 animate-pulse">Loading users list...</div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-500 rounded-md">Error connecting: {error?.error || "Cannot load users"}</div>
            ) : (
                <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-zinc-200">
                    <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">ID</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">Name</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">Email</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">Admin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500">{user._id}</td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">{user.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500">
                                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:text-blue-800">
                                            {user.email}
                                        </a>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {user.isAdmin ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                No
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;
