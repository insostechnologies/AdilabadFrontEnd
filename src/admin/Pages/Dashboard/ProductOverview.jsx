import React, { useMemo, useState } from 'react';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ProductOverview() {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false)


    // date filter section start
    const handleDateChange = (newStartDate, newEndDate) => {
        let dates = {
            newStartDate: newStartDate,
            newEndDate: newEndDate
        };
        setIsClearBtnShown(true)
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        handleDateChange(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        handleDateChange(startDate, date);
    };

    const hideClearBtn = () => {
        setIsClearBtnShown(false)
        setStartDate(null)
        setEndDate(null)
    }
    // date filter section send

    //   table section start
    const columns = useMemo(
        () => [
            {
                accessorKey: 'Image',
                header: 'Image',
            },
            {
                accessorKey: 'Product_Name',
                header: 'Product Name',
            },
            {
                accessorKey: 'Product_Id',
                header: 'Product Id',
            },
            {
                accessorKey: 'Price',
                header: 'Price',
            },
            {
                accessorKey: 'MRP',
                header: 'MRP',
            },
            {
                accessorKey: 'off',
                header: 'Off',
            },
            {
                accessorKey: 'Quantity',
                header: 'Quantity',
            },
            {
                accessorKey: 'Vendor_name',
                header: 'Vendor Name',
            },
            {
                accessorKey: 'Customer_name',
                header: 'Customer Name',
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
        ],
        []
    );

    // Temporary data
    const data = useMemo(() => [
        {
            Image: 'url-to-image',
            Product_Name: 'Product 1',
            Product_Id: '1234',
            Price: '$20',
            MRP: '$25',
            off: '20%',
            Quantity: '100',
            Vendor_name: 'Vendor A',
            Customer_name: 'Customer A',
            status: 'Shipped',
        },
    ], []);
    //   table section end

    return (
        <>
            {/* product-overview */}
            <div className="main-content-wrap">
                <div className="tf-section">
                    <div className="wg-box">
                        <div className="flex items-center justify-between">
                            <h5>Orders overview</h5>
                            {/* date filter */}
                            <div className="flex items-center flex-wrap gap20 mb-27 date-pick">
                                <div className='DatePicker-wrap' style={{
                                    display: 'flex',
                                    fontSize: '13px',
                                    alignItems: 'center',
                                    gap: '10px',
                                    zIndex: '10',
                                    outline: '1px dashed lightgray',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    flexWrap: 'wrap'
                                }}>
                                    <DatePicker
                                        id="startDate"
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        dateFormat="dd MMM yyyy"
                                        placeholderText="Start Date"
                                        autoComplete='off'
                                    />
                                    <DatePicker
                                        id="endDate"
                                        selected={endDate}
                                        onChange={handleEndDateChange}
                                        dateFormat="dd MMM yyyy"
                                        placeholderText="End Date"
                                        autoComplete='off'
                                    />
                                    {
                                        isClearBtnShown
                                        &&
                                        <button
                                            className='btn btn-lg'
                                            style={{ width: 'fit-content', padding: '4px 10px', fontSize: '12px', backgroundColor: '#505356', color: '#fff' }}
                                            onClick={() => hideClearBtn()}>
                                            Clear
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* Pass both columns and data to ReactTable */}
                        <ReactTable columns={columns} data={data} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductOverview;
