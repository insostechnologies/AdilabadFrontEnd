import React, { useEffect, useState } from 'react';
import './AboutUs.css';
import { config } from '../../../../config';
import Navbar from '../../../components/Navbar/Navbar';
import HomeMobHeader from '../../Home/HomeMobHeader/HomeMobHeader';

function AboutUs() {
    const [members, setMembers] = useState([]);
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');
    const [about, setAbout] = useState('');

    const getAbout = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/site/about`, {
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
                setMission(result.data.mission);
                setVision(result.data.vision);
                setAbout(result.data.about);
            }
        } catch (error) {
            console.error(error);
        }
    };

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
            console.error('Fetching team members failed', error);
        }
    };

    useEffect(() => {
        getTeamMembers();
        getAbout();
    }, []);

    return (
        <div className="aboutUsContainer">
            <Navbar />
            <HomeMobHeader />

            {/* About, Mission, and Vision Section */}
            <div className="aboutSection">
                <h2 className="sectionTitle">About Us</h2>
                <p className="aboutText">{about}</p>

                <h2 className="sectionTitle">Our Mission</h2>
                <p className="missionText">{mission}</p>

                <h2 className="sectionTitle">Our Vision</h2>
                <p className="visionText">{vision}</p>
            </div>

            {/* Team Section */}
            <div className="teamSection">
                <h2 className="sectionTitle">Our Team</h2>
                <div className="teamCards">
                    {members.map((member) => (
                        <div key={member.id} className="teamCard">
                            <img
                                src={`${config.backEndBaseUrl}${member.img_path}`}
                                alt={member.name}
                                className="teamImage"
                            />
                            <div className="teamInfo">
                                <h3 className="teamName">{member.name}</h3>
                                <p className="teamDesignation">{member.designation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
