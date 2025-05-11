import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Revenue() {
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
    // date filter section end

    return (
        <>
            <div className="wg-box">
                <div className="flex items-start justify-between">
                    <h5>Cetagory Visits</h5>

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
                <div className="flex flex-wrap gap40">
                    <div>
                        <div className="mb-3">
                            <div className="block-legend">
                                <div className="dot t1"></div>
                                <div className="text-tiny">Category</div>
                            </div>
                        </div>
                        <div className="flex items-center gap10">
                            <h4>37,802</h4>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up"></i>
                                <div className="body-title number">0.96%</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-3">
                            <div className="block-legend">
                                <div className="dot t3"></div>
                                <div className="text-tiny">Sub-Category</div>
                            </div>
                        </div>
                        <div className="flex items-center gap10">
                            <h4>28,305</h4>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up"></i>
                                <div className="body-title number">0.56%</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* chart */}
                <Chart
                    chartType="BarChart"
                    data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                    width="100%"
                    height="250px"
                    legendToggle
                />
            </div>
        </>
    )
}

export default Revenue