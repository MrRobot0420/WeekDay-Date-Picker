import React, { useCallback, useState } from 'react';
import './DatePicker.css';

type DateComponent = {
    startDate: Date | null;
    endDate: Date | null;
};

type DateProps = {
    onChange: (selectedDates: DateComponent, weekends: Date[]) => void;
    predefinedDateRanges?: { label: string; range: DateComponent }[];
};

const DatePicker: React.FC<DateProps> = ({ onChange, predefinedDateRanges }) => {
    const [currentDate, setCurrentDate] = useState(new Date()); // state to track the current date
    const [dateRange, setDateRange] = useState<DateComponent>({ startDate: null, endDate: null }); // state to track the selected date

    // This is a function that gets all days of the months.
    const getMonthsAndDays = useCallback((year: number, month: number) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Calculate the number of leading empty slots for the first week.
        const startDay = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
        for (let i = 0; i < startDay; i++) {
            days.push(null); // Placeholder for empty slots before the start of the month.
        }

        // Add days of the month.
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        // Calculate the number of trailing empty slots for the last week.
        const endDay = new Date(year, month, daysInMonth).getDay(); // 0 (Sunday) to 6 (Saturday)
        for (let i = endDay + 1; i < 7; i++) {
            days.push(null); // Placeholder for empty slots after the end of the month.
        }

        return days;
    }, []);

    // This is a function to check if a date is a weekend or not.
    const isWeekend = useCallback((date: Date) => {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    }, []);

    // This is a function to get all weekends in a given particular date range.
    const getWeekendsInDateRange = useCallback((range: DateComponent): Date[] => {
        const weekends = [];
        let current = new Date(range.startDate!);

        while (current <= range.endDate!) {
            if (isWeekend(current)) {
                weekends.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }

        return weekends;
    }, [isWeekend]);

    // This is a function to handle all the date clicks with respect to setting/updating the dates and its range.
    const handleDateClick = useCallback((date: Date) => {
        if (!date || isWeekend(date)) return;
    
        setDateRange(previousRange => {
            // Check if clicking on the same date again to deselect
            if (previousRange.startDate && previousRange.startDate.getTime() === date.getTime()) {
                onChange({ startDate: null, endDate: null }, []); // Deselect
                return { startDate: null, endDate: null };
            } else if (previousRange.startDate && !previousRange.endDate && date >= previousRange.startDate) {
                const newRange = { startDate: previousRange.startDate, endDate: date };
                const weekends = getWeekendsInDateRange(newRange);
                onChange(newRange, weekends);
                return newRange;
            } else {
                const newRange = { startDate: date, endDate: null };
                onChange(newRange, []);
                return newRange;
            }
        });
    }, [getWeekendsInDateRange, isWeekend, onChange]);

    // Function to change the displayed month.
    const changeTheMonth = (offset: number) => setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + offset, 1));
    // Function to change the displayed year.
    const changeTheYear = (offset: number) => setCurrentDate(prevDate => new Date(prevDate.getFullYear() + offset, prevDate.getMonth(), 1));

    // This Function handles all the predefined date range clicks.
    const handlePredefinedDateRangeClick = (range: DateComponent) => {
        setDateRange(prevRange => {
            if (prevRange.startDate === range.startDate && prevRange.endDate === range.endDate) {
                onChange({ startDate: null, endDate: null }, []);
                return { startDate: null, endDate: null };
            } else {
                const weekends = getWeekendsInDateRange(range);
                onChange(range, weekends);
                return range;
            }
        });
    };

    // Get all the current displayed months.
    const monthDays = getMonthsAndDays(currentDate.getFullYear(), currentDate.getMonth());
    const today = new Date().toDateString();

    return (
        <div className='weekday-date-picker'>
            <div className='controls'>
                <button onClick={() => changeTheYear(-1)}>«</button>
                <button onClick={() => changeTheMonth(-1)}>‹</button>
                <span>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</span>
                <button onClick={() => changeTheMonth(1)}>›</button>
                <button onClick={() => changeTheYear(1)}>»</button>
            </div>
            <div className='days'>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className='day-label'>{day}</div>
                ))}
                {monthDays.map((eachDate, index) => (
                    <div key={index}
                    className={`day 
                        ${eachDate === null ? 'empty' : ''}
                        ${eachDate && isWeekend(eachDate) ? 'weekend' : ''}
                        ${eachDate && eachDate.toDateString() === today ? 'today' : ''}
                        ${dateRange.startDate && dateRange.endDate && eachDate && eachDate >= dateRange.startDate && eachDate <= dateRange.endDate ? 'range-selected' : ''}
                        ${!dateRange.endDate && eachDate && eachDate.getTime() === dateRange.startDate?.getTime() ? 'selected' : ''}`}
                        onClick={() => eachDate && handleDateClick(eachDate)}>
                        {eachDate ? eachDate.getDate() : ''}
                    </div>
                ))}
            </div>
            {predefinedDateRanges && (
                <div className='predefined-ranges'>
                    {predefinedDateRanges.map((range, index) => (
                        <button key={index}
                            className={`${dateRange.startDate === range.range.startDate && dateRange.endDate === range.range.endDate ? 'active' : ''}`}
                            onClick={() => handlePredefinedDateRangeClick(range.range)}>{range.label}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DatePicker;