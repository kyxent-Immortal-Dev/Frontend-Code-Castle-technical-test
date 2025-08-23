

import { useUsersService } from '../../hooks/useUsers.service'
import { formatDate } from '../../utils/FormatDate'

export const UsersListComponent = () => {
    const { users } = useUsersService();

    console.log(users);

    const getRoleBadge = (role: string) => {
        const roleColors = {
            admin: 'badge-error',
            vendedor: 'badge-warning'
        };
        return <span className={`badge ${roleColors[role as keyof typeof roleColors] || 'badge-info'}`}>{role}</span>;
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? 
            <span className="badge badge-success gap-1">
                <div className="w-2 h-2 bg-current rounded-full"></div>
                Active
            </span> : 
            <span className="badge badge-error gap-1">
                <div className="w-2 h-2 bg-current rounded-full"></div>
                Inactive
            </span>;
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Users Management</h1>
                <p className="text-base-content/70">Manage your system users and their permissions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat bg-base-100 shadow-lg rounded-lg">
                    <div className="stat-figure text-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value text-primary">{users.length}</div>
                    <div className="stat-desc">Registered in the system</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-lg">
                    <div className="stat-figure text-success">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Active Users</div>
                    <div className="stat-value text-success">{users.filter(u => u.is_active).length}</div>
                    <div className="stat-desc">Currently active accounts</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-lg">
                    <div className="stat-figure text-warning">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Admins</div>
                    <div className="stat-value text-warning">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="stat-desc">Administrative users</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="bg-primary text-primary-content">
                                <th className="text-center">User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Last Updated</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-base-200 transition-colors">
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-12">
                                                    <span className="text-lg font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm opacity-50">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>{getStatusBadge(user.is_active)}</td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="font-medium">{formatDate(user.created_at)}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="font-medium">{formatDate(user.updated_at)}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex justify-center space-x-2">
                                            <button className="btn btn-sm btn-outline btn-info">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </button>
                                            <button className="btn btn-sm btn-outline btn-warning">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </button>
                                            <button className="btn btn-sm btn-outline btn-error">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {users.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-2xl font-semibold mb-2">No users found</h3>
                    <p className="text-base-content/70 mb-6">Get started by creating your first user account</p>
                    <button className="btn btn-primary btn-lg">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add First User
                    </button>
                </div>
            )}
        </div>
    )
}
