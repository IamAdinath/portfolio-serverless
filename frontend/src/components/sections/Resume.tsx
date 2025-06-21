import React from 'react';
import './Resume.css';
import { IconButton } from 'evergreen-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faMedium } from '@fortawesome/free-brands-svg-icons';
import { faMobileAndroid, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import StickmanDownload from '../common/stickManDownload';

const Resume: React.FC = () => {
    return (
        <div className="resume-container">
            {/* Header Section */}
            <header className="header">
                <h1>Adinath Gore</h1>
                <h2>Software Engineer</h2>
                <div className="contact-info">
                    {/* Use divs or spans instead of pre for better layout control */}
                    <div><IconButton icon={<FontAwesomeIcon icon={faEnvelope} />} aria-label="Email" /> adinathgore.17@gmail.com</div>
                    <div><IconButton icon={<FontAwesomeIcon icon={faMobileAndroid} />} aria-label="Mobile" /> +919579519806</div>
                    <div><IconButton icon={<FontAwesomeIcon icon={faLinkedin} />} aria-label="LinkedIn" /> <a href="https://www.linkedin.com/in/primewhites/">LinkedIn</a></div>
                    <div><IconButton icon={<FontAwesomeIcon icon={faMedium} />} aria-label="Medium Blogs" /> <a href="https://medium.com/@adinath.17">Blogs</a></div>
                </div>
            </header>

            {/* Summary Section */}
            <section className="summary-section">
                 <h3>Summary</h3> {/* Added heading for clarity */}
                <p>
                    I am a dedicated problem solver with a strong background in software engineering, showcasing over 5 years of experience.
                    My technical expertise spans a variety of technologies, including proficiency in Python, AWS cloud services, and databases
                    like PostgreSQL, MySQL, MongoDB, and DynamoDB.
                </p>
            </section>

            {/* NEW: Main Content Area for Columns */}
            <div className="main-content">

                {/* Left Column */}
                <div className="left-column">
                    <section className="skills-section">
                        <h3>Skills</h3>
                        <ul className="skills-list">
                            <li>Python</li>
                            <li>Django</li>
                            <li>Flask</li>
                            <li>Serverless</li>
                            <li>RestAPI</li>
                            <li>GraphQL</li>
                            <li>JavaScript</li>
                            <li>AWS</li>
                            <li>Lambda</li>
                            <li>CloudFront</li>
                            <li>MongoDB</li>
                            <li>Code Review</li>
                            <li>Git</li>
                            <li>CI/CD</li>
                            <li>Kafka</li>
                            <li>Jira</li>
                            <li>PostgreSQL</li>
                            <li>MySQL</li>
                            <li>API Gateway</li>
                            <li>RDS</li>
                        </ul>
                    </section>

                    <section className="certification-section">
                        <h3>Certification</h3>
                        {/* Consider structuring certifications better, maybe divs per source */}
                         <div className="certification-group">
                            <strong>Linkedin</strong>
                            <ul>
                                <li>
                                    <a href="https://www.linkedin.com/learning/certificates/e8c4b5ded0908d47fb2d6458a1ed6c219de127e34f6beb3842305de91b92b909?u=1810">
                                        Artificial Intelligence and Business Strategy
                                    </a>
                                </li>
                            </ul>
                         </div>
                         <div className="certification-group">
                            <strong>Udemy</strong>
                            <ul>
                                <li>
                                    <a href="https://www.udemy.com/certificate/UC-bc48da75-4011-42bc-9d09-f7fc1151151e022/?utm_source=sendgrid.com&utm_medium=email&utm_campaign=email">
                                        Data Science & Machine Learning
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.udemy.com/certificate/UC-b4e524ff-92af-45f5-82c6-01163bea9f2a/">
                                        Python & React for Blockchain
                                    </a>
                                </li>
                             </ul>
                         </div>
                         <div className="certification-group">
                             <strong>HackerRank</strong>
                             <ul>
                                <li>
                                    <a href="https://www.hackerrank.com/certificates/36ca56e7716a">
                                        Python
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.hackerrank.com/certificates/aadd3de22555">
                                        SQL
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <section className="awards-section">
                        <h3>Awards</h3>
                         {/* Consider structuring awards better, maybe divs per company */}
                         <div className="award-group">
                            <strong>Futops Technologies India Pvt. Ltd</strong>
                            <ul>
                                <li>Spot (Special Performance on Time) (Dec 2022)</li>
                             </ul>
                         </div>
                         <div className="award-group">
                             <strong>EC Infosolutions Pvt. Ltd</strong>
                             <ul>
                                <li>Employee of the Quarter (Quarter 2 & Quarter 3, 2021) </li>
                            </ul>
                         </div>
                          <div className="award-group">
                            <strong>Algo.com</strong>
                             <ul>
                                <li>Star Performer (Jul 2020 & Aug 2020) </li>
                             </ul>
                         </div>
                    </section>
                </div> {/* End Left Column */}

                {/* Right Column */}
                <div className="right-column">
                    <section className="experience-section">
                        <h3>Work Experience</h3>
                        <div className="experience-item">
                            <h4>Software Developer II</h4>
                            <strong>Rackspace Technology (Mar 2024 - Present)</strong>
                            <ul>
                                <li>Automated billing module to reduce mis-calculations and impove efficiency</li>
                                <li>Conducted code reviews with peers to improve code quality.</li>
                                <li>Improved policy details and enhanced the data protection module.</li>
                            </ul>
                        </div>
                        <div className="experience-item">
                            <h4>Software Engineer</h4>
                            <strong>Futops Technologies India Private Limited (May 2022 - Mar 2024)</strong>
                            <ul>
                                <li>Developed REST APIs and implemented authentication protocols, such as OAuth, to securely expose data to clients</li>
                                <li>Created a Continuous Integration/Continuous Deployment (CI/CD) pipeline that reduced time-to-deployment by 60%.</li>
                                <li>Improved database performance by 12% through query optimization and indexing</li>
                                <li>Implemented a microservices architecture that improved system modularity and reduced dependencies between components</li>
                                <li>Led a team of 7 developers to successfully complete a major software project on time and within budget</li>
                                <li>Conducted code reviews and mentored junior developers to improve code quality.</li>
                            </ul>
                        </div>
                        {/* ... other experience items ... */}
                         <div className="experience-item">
                            <h4>Python Developer</h4>
                            <strong>EC Infosolutions Pvt. Ltd (Jan 2021 - Apr 2022)</strong>
                            <ul>
                                <li>Developed a web application using Python and Django that improved scalability and reliability</li>
                                <li>Developed and maintained software in multiple programming languages, such as Python, and Typescript</li>
                                <li>Refactored legacy code to improve reliability, scalability and maintainability</li>
                                <li>Implemented automated testing that increased code coverage to 85%, reducing the number of production issues by 74%</li>
                            </ul>
                        </div>
                        <div className="experience-item">
                            <h4>Junior Developer</h4>
                            <strong>Algo.com (May 2020 - Nov 2020)</strong>
                            <ul>
                                <li>Developed a web application that improved customer experience by 40% </li>
                                <li>Developed an API that enabled data exchange between different systems </li>
                                <li>Wrote unit tests that increased code coverage to 80%</li>
                                <li>Improved application performance by 35% through refactoring and code optimization</li>
                                <li>Wrote technical documentation that enabled other developers to quickly understand the application architecture</li>
                            </ul>
                        </div>
                        <div className="experience-item">
                            <h4>Python Developer</h4>
                            <strong>Strategy Analysis (Dec 2018 - Apr 2020)</strong>
                            <ul>
                                <li>Created a web crawler that identified over 20 new sources of data, resulting in a 2% increase in revenue for the company</li>
                                <li>Created a dashboard that visually represented key business metrics in real time, allowing for quick and informed decision-making by management</li>
                            </ul>
                        </div>
                    </section>

                   
                </div> {/* End Right Column */}
                <StickmanDownload />
            
            </div> {/* End Main Content Area */}
        </div>
    );
};

export default Resume;
