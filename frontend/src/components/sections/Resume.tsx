import React from 'react';
import './Resume.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faMedium } from '@fortawesome/free-brands-svg-icons';
import { faMobileAndroid, faEnvelope, faAward, faCertificate, faCode, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import StickmanDownload from '../common/stickManDownload';
import { usePageTitle } from '../common/usePageTitle';
import { CONTACT } from '../../constants';

const Resume: React.FC = () => {
    usePageTitle('Resume');
    return (
        <div className="resume-container">
            {/* Header Section */}
            <header className="header-card">
                <div className="profile-section">
                    <div className="profile-avatar">
                        <span className="avatar-text">AG</span>
                    </div>
                    <div className="profile-info">
                        <h1>Adinath Gore</h1>
                        <h2>Software Engineer</h2>
                        <p className="profile-tagline">5+ Years of Experience in Full-Stack Development</p>
                    </div>
                </div>
                <div className="contact-info">
                    <div className="contact-item">
                        <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                        <span>{CONTACT.EMAIL}</span>
                    </div>
                    <div className="contact-item">
                        <FontAwesomeIcon icon={faMobileAndroid} className="contact-icon" />
                        <span>+9195xxxxxxx6</span>
                    </div>
                    <div className="contact-item">
                        <FontAwesomeIcon icon={faLinkedin} className="contact-icon" />
                        <a href="https://www.linkedin.com/in/primewhites/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
                    <div className="contact-item">
                        <FontAwesomeIcon icon={faMedium} className="contact-icon" />
                        <a href="https://medium.com/@adinath.17" target="_blank" rel="noopener noreferrer">Blogs</a>
                    </div>
                </div>
            </header>

            {/* Summary Section */}
            <section className="summary-card">
                <div className="card-header">
                    <h3>Professional Summary</h3>
                </div>
                <div className="card-content">
                    <p>
                        I am a dedicated problem solver with a strong background in software engineering, showcasing over 5 years of experience.
                        My technical expertise spans a variety of technologies, including proficiency in Python, AWS cloud services, and databases
                        like PostgreSQL, MySQL, MongoDB, and DynamoDB.
                    </p>
                </div>
            </section>

            {/* NEW: Main Content Area for Columns */}
            <div className="main-content">

                {/* Left Column */}
                <div className="left-column">
                    <section className="skills-card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faCode} className="section-icon" />
                            <h3>Technical Skills</h3>
                        </div>
                        <div className="card-content">
                            <div className="skills-category">
                                <h4>Languages & Frameworks</h4>
                                <div className="skills-list">
                                    <span className="skill-tag">Python</span>
                                    <span className="skill-tag">Django</span>
                                    <span className="skill-tag">Flask</span>
                                    <span className="skill-tag">JavaScript</span>
                                    <span className="skill-tag">TypeScript</span>
                                </div>
                            </div>
                            <div className="skills-category">
                                <h4>Cloud & DevOps</h4>
                                <div className="skills-list">
                                    <span className="skill-tag">AWS</span>
                                    <span className="skill-tag">Lambda</span>
                                    <span className="skill-tag">CloudFront</span>
                                    <span className="skill-tag">API Gateway</span>
                                    <span className="skill-tag">CI/CD</span>
                                    <span className="skill-tag">Serverless</span>
                                </div>
                            </div>
                            <div className="skills-category">
                                <h4>Databases & APIs</h4>
                                <div className="skills-list">
                                    <span className="skill-tag">PostgreSQL</span>
                                    <span className="skill-tag">MySQL</span>
                                    <span className="skill-tag">MongoDB</span>
                                    <span className="skill-tag">RDS</span>
                                    <span className="skill-tag">RestAPI</span>
                                    <span className="skill-tag">GraphQL</span>
                                </div>
                            </div>
                            <div className="skills-category">
                                <h4>Tools & Others</h4>
                                <div className="skills-list">
                                    <span className="skill-tag">Git</span>
                                    <span className="skill-tag">Jira</span>
                                    <span className="skill-tag">Kafka</span>
                                    <span className="skill-tag">Code Review</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="certification-card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faCertificate} className="section-icon" />
                            <h3>Certifications</h3>
                        </div>
                        <div className="card-content">
                            <div className="certification-item">
                                <div className="cert-provider">LinkedIn Learning</div>
                                <a href="https://www.linkedin.com/learning/certificates/e8c4b5ded0908d47fb2d6458a1ed6c219de127e34f6beb3842305de91b92b909?u=1810"
                                    target="_blank" rel="noopener noreferrer" className="cert-link">
                                    Artificial Intelligence and Business Strategy
                                </a>
                            </div>
                            <div className="certification-item">
                                <div className="cert-provider">Udemy</div>
                                <a href="https://www.udemy.com/certificate/UC-bc48da75-4011-42bc-9d09-f7fc1151151e022/?utm_source=sendgrid.com&utm_medium=email&utm_campaign=email"
                                    target="_blank" rel="noopener noreferrer" className="cert-link">
                                    Data Science & Machine Learning
                                </a>
                            </div>
                            <div className="certification-item">
                                <div className="cert-provider">Udemy</div>
                                <a href="https://www.udemy.com/certificate/UC-b4e524ff-92af-45f5-82c6-01163bea9f2a/"
                                    target="_blank" rel="noopener noreferrer" className="cert-link">
                                    Python & React for Blockchain
                                </a>
                            </div>
                            <div className="certification-item">
                                <div className="cert-provider">HackerRank</div>
                                <a href="https://www.hackerrank.com/certificates/36ca56e7716a"
                                    target="_blank" rel="noopener noreferrer" className="cert-link">
                                    Python Certification
                                </a>
                            </div>
                            <div className="certification-item">
                                <div className="cert-provider">HackerRank</div>
                                <a href="https://www.hackerrank.com/certificates/aadd3de22555"
                                    target="_blank" rel="noopener noreferrer" className="cert-link">
                                    SQL Certification
                                </a>
                            </div>
                        </div>
                    </section>
                    <section className="awards-card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faAward} className="section-icon" />
                            <h3>Awards & Recognition</h3>
                        </div>
                        <div className="card-content">
                            <div className="award-item">
                                <div className="award-title">Spot Award (Special Performance on Time)</div>
                                <div className="award-company">Futops Technologies India Pvt. Ltd</div>
                                <div className="award-date">December 2022</div>
                            </div>
                            <div className="award-item">
                                <div className="award-title">Employee of the Quarter</div>
                                <div className="award-company">EC Infosolutions Pvt. Ltd</div>
                                <div className="award-date">Q2 & Q3 2021</div>
                            </div>
                            <div className="award-item">
                                <div className="award-title">Star Performer</div>
                                <div className="award-company">Algo.com</div>
                                <div className="award-date">July & August 2020</div>
                            </div>
                        </div>
                    </section>
                </div> {/* End Left Column */}

                {/* Right Column */}
                <div className="right-column">
                    <section className="experience-card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faBriefcase} className="section-icon" />
                            <h3>Work Experience</h3>
                        </div>
                        <div className="card-content">
                            <div className="experience-item">
                                <div className="experience-header">
                                    <div className="company-logo">
                                        RS
                                    </div>
                                    <div className="experience-info">
                                        <h4>Software Developer II</h4>
                                        <div className="experience-meta">
                                            <span className="company">Rackspace Technology</span>
                                            <span className="duration">Mar 2024 - Present</span>
                                        </div>
                                    </div>
                                </div>
                                <ul className="achievements">
                                    <li>Automated billing module to reduce mis-calculations and improve efficiency</li>
                                    <li>Conducted code reviews with peers to improve code quality</li>
                                    <li>Improved policy details and enhanced the data protection module</li>
                                </ul>
                            </div>

                            <div className="experience-item">
                                <div className="experience-header">
                                    <div className="company-logo">
                                        FT
                                    </div>
                                    <div className="experience-info">
                                        <h4>Software Engineer</h4>
                                        <div className="experience-meta">
                                            <span className="company">Futops Technologies India Private Limited</span>
                                            <span className="duration">May 2022 - Mar 2024</span>
                                        </div>
                                    </div>
                                </div>
                                <ul className="achievements">
                                    <li>Developed REST APIs and implemented authentication protocols, such as OAuth, to securely expose data to clients</li>
                                    <li>Created a Continuous Integration/Continuous Deployment (CI/CD) pipeline that reduced time-to-deployment by <strong>60%</strong></li>
                                    <li>Improved database performance by <strong>12%</strong> through query optimization and indexing</li>
                                    <li>Implemented a microservices architecture that improved system modularity and reduced dependencies between components</li>
                                    <li>Led a team of <strong>7 developers</strong> to successfully complete a major software project on time and within budget</li>
                                    <li>Conducted code reviews and mentored junior developers to improve code quality</li>
                                </ul>
                            </div>

                            <div className="experience-item">
                                <div className="experience-header">
                                    <div className="company-logo">
                                        EC
                                    </div>
                                    <div className="experience-info">
                                        <h4>Python Developer</h4>
                                        <div className="experience-meta">
                                            <span className="company">EC Infosolutions Pvt. Ltd</span>
                                            <span className="duration">Jan 2021 - Apr 2022</span>
                                        </div>
                                    </div>
                                </div>
                                <ul className="achievements">
                                    <li>Developed a web application using Python and Django that improved scalability and reliability</li>
                                    <li>Developed and maintained software in multiple programming languages, such as Python, and TypeScript</li>
                                    <li>Refactored legacy code to improve reliability, scalability and maintainability</li>
                                    <li>Implemented automated testing that increased code coverage to <strong>85%</strong>, reducing production issues by <strong>74%</strong></li>
                                </ul>
                            </div>

                            <div className="experience-item">
                                <div className="experience-header">
                                    <div className="company-logo">
                                        AL
                                    </div>
                                    <div className="experience-info">
                                        <h4>Junior Developer</h4>
                                        <div className="experience-meta">
                                            <span className="company">Algo.com</span>
                                            <span className="duration">May 2020 - Nov 2020</span>
                                        </div>
                                    </div>
                                </div>
                                <ul className="achievements">
                                    <li>Developed a web application that improved customer experience by <strong>40%</strong></li>
                                    <li>Developed an API that enabled data exchange between different systems</li>
                                    <li>Wrote unit tests that increased code coverage to <strong>80%</strong></li>
                                    <li>Improved application performance by <strong>35%</strong> through refactoring and code optimization</li>
                                    <li>Wrote technical documentation that enabled other developers to quickly understand the application architecture</li>
                                </ul>
                            </div>
                        </div>
                    </section>


                </div> {/* End Right Column */}
                <StickmanDownload />

            </div> {/* End Main Content Area */}
        </div>
    );
};

export default Resume;
