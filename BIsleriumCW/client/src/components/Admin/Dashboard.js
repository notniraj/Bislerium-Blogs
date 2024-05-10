import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'; // Import custom CSS for additional styling
import TextInput from '../Common/TextInput';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';


const Dashboard = () => {
    const [allTimeStats, setAllTimeStats] = useState({});
    const [topBloggers, setTopBloggers] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [dailyActivity, setDailyActivity] = useState([]);

    useEffect(() => {
        const fetchAllTimeStats = async () => {
            try {
                const response = await axios.get('https://localhost:7212/api/Admin/allTime');
                setAllTimeStats(response.data);
            } catch (error) {
                console.error('Error fetching all-time stats:', error);
            }
        };

        const fetchTopBloggers = async () => {
            try {
                const response = await axios.get('https://localhost:7212/api/Admin/top-10-bloggers');
                setTopBloggers(response.data);
            } catch (error) {
                console.error('Error fetching top bloggers:', error);
            }
        };

        fetchAllTimeStats();
        fetchTopBloggers();
    }, []);

    const fetchDailyActivity = async () => {
        try {
            const response = await axios.get(`https://localhost:7212/api/Admin/daily-activity-monthly?Year=${selectedYear}&Month=${selectedMonth}`);
            setDailyActivity(response.data);
        } catch (error) {
            console.error('Error fetching daily activity for the month:', error);
        }
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleSearch = () => {
        fetchDailyActivity();
    };

    return (
        <div className="container-fluid mt-4 d-flex flex-column gap-2">
            <h1 className="text-center mb-4 text-white">Admin Dashboard</h1>

            <Row>
                <Col md={6} className="mb-4 rounded-5">
                    <Card>
                        <Card.Body>
                            <Card.Title className="white text-center">All-Time Stats</Card.Title>
                            <Bar
                                data={{
                                    labels: ['Total Blog Posts', 'Total Upvotes', 'Total Downvotes', 'Total Comments'],
                                    datasets: [
                                        {
                                            label: 'Count',
                                            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                                            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                                            borderWidth: 1,
                                            data: [allTimeStats.TotalBlogPosts, allTimeStats.TotalUpvotes, allTimeStats.TotalDownvotes, allTimeStats.TotalComments],
                                        },
                                    ],
                                }}
                                options={{
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true,
                                            },
                                        }],
                                    },
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-4 rounded-5">
                    <Card>
                        <Card.Body className="rounded-5">
                            <Card.Title className="text-center">Top 10 Bloggers</Card.Title>
                            <Pie
                                width={400} // Adjust the width of the pie chart
                                height={100} // Adjust the height of the pie chart
                                data={{
                                    labels: topBloggers.map(blogger => blogger.Username),
                                    datasets: [
                                        {
                                            label: 'Top Bloggers',
                                            backgroundColor: [
                                                '#FF6384', '#36A2EB', '#FFCE56', '#8B008B', '#FF4500', '#4B0082', '#00CED1', '#32CD32', '#800080', '#FFD700'
                                            ],
                                            hoverBackgroundColor: [
                                                '#FF6384', '#36A2EB', '#FFCE56', '#8B008B', '#FF4500', '#4B0082', '#00CED1', '#32CD32', '#800080', '#FFD700'
                                            ],
                                            data: topBloggers.map(blogger => blogger.TotalPosts)
                                        }
                                    ]
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>



            </Row>

            <Row>
                <Col md={12} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">Daily Activity for the Month</Card.Title>
                            <div className="w-50">
                                <label>Month:</label>
                                <TextInput  type="number" value={selectedMonth} onChange={handleMonthChange} />
                            </div>
                            <div className="w-50">
                                <label>Year:</label>
                                <TextInput type="number" value={selectedYear} onChange={handleYearChange} />
                            </div>
                            <button className="btn btn-adds my-4 w-25" onClick={handleSearch}>Search</button>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Blog Post Count</th>
                                        <th>Upvote Count</th>
                                        <th>Downvote Count</th>
                                        <th>Comment Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dailyActivity.map((activity, index) => (
                                        <tr key={index}>
                                            <td>{activity.Date}</td>
                                            <td>{activity.BlogPostCount}</td>
                                            <td>{activity.UpvoteCount}</td>
                                            <td>{activity.DownvoteCount}</td>
                                            <td>{activity.CommentCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
