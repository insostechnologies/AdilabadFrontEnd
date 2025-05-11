import React, { useEffect, useMemo, useState } from 'react'
import './notifications.css'
import InputArea from './InputArea/InputArea'
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';
import { config } from '../../../config';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import { FaRegTrashAlt } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Notifications = () => {
    const [tab, setTab] = useState("all")
    const { isSidebar } = useContext(AdminSidebarContext);
    const [notificationList, setNotificationList] = useState([])

    const getNotificationList = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/promotions/notifications`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.status) {
                const sortedNotifications = data.data.sort((a, b) => new Date(b.latest_created_at) - new Date(a.latest_created_at));
                setNotificationList(sortedNotifications);
                console.log('Notification list:', sortedNotifications);

            } else {
                console.log(data.message);
                setNotificationList([])
            }
        } catch (error) {
            console.error('Error fetching notification list:', error);
        }
    };

    useEffect(() => {
        getNotificationList()
    }, [])
    const handleDelete = (title) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this category?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await fetch(`${config.backEndBaseUrl}api/promotions/notifications/delete?t=${title}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            getNotificationList()
                        } catch (error) {
                            console.error('Error deleting category:', error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };
    const columns = useMemo(
        () => [
            {
                header: 'Date',
                accessorKey: 'latest_created_at',
            },
            {
                header: 'Title',
                accessorKey: 'title',
            },
            {
                header: 'Message',
                accessorKey: 'message',
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
                header: 'URL',
                accessorKey: 'url',
                Cell: ({ row }) => <a href={row.original.url} target="_blank" rel="noopener noreferrer">{row.original.url}</a>,
            },
            {
                header: 'Sent To',
                accessorKey: 'count',
                Cell: ({ row }) => <span>{row.original.count} {row.original.count == 1 ? `user` : `users`}</span>,
            },
            {
                accessorKey: 'uid',
                header: 'Action',
                Cell: ({ row, cell }) => {
                    return (
                        <div className={`actionBtn-wrapper `} >
                            <div
                                className='actionBtn btn btn-lg btn-danger m-2'
                                onClick={() => handleDelete(cell.row.original.title)}
                            >
                                <FaRegTrashAlt />
                            </div>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (


        <>
            <div className="body">
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner">
                                        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                                            <h3>Push Notification</h3>
                                        </div>
                                        <div className='notifications'>
                                            <div className="main-box">
                                                <InputArea tab={tab} setTab={setTab} />
                                            </div>
                                        </div>
                                        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                                            <h3>All Notification</h3>
                                        </div>
                                        <ReactTable columns={columns} data={notificationList} />
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
export default Notifications