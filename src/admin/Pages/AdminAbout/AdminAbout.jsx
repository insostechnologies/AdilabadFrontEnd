import React, { useContext, useEffect, useMemo, useState } from 'react'
import './AdminAbout.css'
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../context/adminSidebarContext.js';
import { Link } from 'react-router-dom';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import { config } from '../../../config.js';
import { FaRegTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminAbout() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [members, setMembers] = useState([]);

    const getTeamMembers = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/members`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setMembers(result.data);
            }

        } catch (error) {
            console.error('Fetching categories failed', error);
        }
    };

    const deleteMember = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/members/delete/${uid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                toast.success('Member deleted successfully', { position: 'top-center' });
                getTeamMembers(); // Refresh the list after deletion
            } else {
                toast.error('Failed to delete member', { position: 'top-center' });
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.error('Error deleting member', { position: 'top-center' });
        }
    };

    useEffect(() => {
        getTeamMembers();
    }, []);

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Designation',
                accessorKey: 'designation',
            },
            {
                header: 'Image',
                accessorKey: 'img_path',
                Cell: ({ row }) => (
                    <img
                        src={`${config.backEndBaseUrl}${row.original.img_path}`}
                        alt="Notification"
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                    />
                ),
            },
            {
                header: 'Actions',
                accessorKey: 'actions',
                Cell: ({ row }) => (
                    <button
                        className="btn btn-danger btn-lg"
                        onClick={() => deleteMember(row.original.uid)}
                    >
                        <FaRegTrashAlt />
                    </button>
                ),
            },
        ],
        []
    );

    return (
        <>
            <ToastContainer />
            <div className="body">
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner">
                                        <div className="items-center flex-wrap gap20 mb-27">
                                            <h3 className="mb-5">About</h3>
                                            <Link className='btn btn-lg btn-success' to={`/admin/about/update`} style={{
                                                width: 'fit-content',
                                                padding: '10px 15px',
                                                fontSize: '14px',
                                                marginRight: '10px',
                                            }}>
                                                Update About
                                            </Link>
                                            <Link className='btn btn-lg btn-success' to={`/admin/about/team/add`} style={{
                                                width: 'fit-content',
                                                padding: '10px 15px',
                                                fontSize: '14px',
                                                marginRight: '10px'
                                            }}>
                                                Add Team Member
                                            </Link>
                                            <Link className='btn btn-lg btn-success' to={`/admin/about/policy`} style={{
                                                width: 'fit-content',
                                                padding: '10px 15px',
                                                fontSize: '14px',
                                            }}>
                                                T&C & Privacy Policy
                                            </Link>
                                        </div>
                                        <h5 className='mb-6'>Team Members</h5>
                                        <ReactTable columns={columns} data={members} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminAbout