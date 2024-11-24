import { EFormatType, formatDate } from '@/utils/helpers';
import { GenerateJDParams, GenerateResumeParams, ResumeType } from './open-ai.type';

export const generateJDQuestion = (params: GenerateJDParams, potentialCV?: string) => {
  if (params.platform) {
    return `
    As a seasoned hiring manager with over 8 years of experience, you’re seeking top candidates for your company. Please format the job ad in HTML, limited to 1000 words, using <strong> tags within headings but excluding a <title> tag. 

    Create a job ad for a ${params.type} ${params.level} position in ${params.language}, designed for posting on ${params.platform}. Structure the ad with the following sections: 
    1. About the Role
    2. Responsibilities
    3. Qualifications
    4. Benefits (vary section titles slightly to be more engaging)

    This position falls under the ${params.category} category. Ensure relevant keywords appear in each section:
    ${params.role ? `Role Overview: ${params.role}.\n` : ''}
    ${params.responsibility ? `Key Responsibilities: ${params.responsibility}.\n` : ''}
    ${params.qualification ? `Required Qualifications: ${params.qualification}.\n` : ''}
    ${params.benefit ? `Perks & Benefits: ${params.benefit}.\n` : ''}
    ${potentialCV ? `Use this candidate’s profile for reference:\n"${potentialCV}"\n` : ''}

    Refer to this example job ad for a Mid-Level Software Engineer as a model:
    "<h2><strong>Are You Our Next Mid-Level Software Engineering Superstar?</strong></h2>
    <h2><strong>Role Overview:</strong></h2>
    <p>As a Mid-Level Software Engineer, you’ll be integral to our team, working on exciting projects that test your technical skills and creativity. Collaborate with experts, mentor juniors, and make a lasting impact in a dynamic work environment.</p>
    ...
    \nEnsure the output uses a ${params.tone} tone.
    `;
  }

  return `
    As a seasoned hiring manager with over 8 years of experience, craft a Job Description for a ${params.type} ${params.level} ${params.title} role in ${params.language}.
    Format in HTML, limited to 1000 words, using <strong> tags within headings and excluding a <title> tag.
    Structure should include sections for About the Role, Responsibilities, Qualifications, and Benefits.

    Position Category: ${params.category}. Include the following keywords:
    ${params.role ? `Role Overview: ${params.role}.\n` : ''}
    ${params.responsibility ? `Key Responsibilities: ${params.responsibility}.\n` : ''}
    ${params.qualification ? `Required Qualifications: ${params.qualification}.\n` : ''}
    ${params.benefit ? `Perks & Benefits: ${params.benefit}.\n` : ''}

    Example Job Description for Mid-Level Software Engineer to reference:
    "<h2><strong>About the Role</strong></h2>
    <p>As a Mid-Level Software Engineer, you’ll play a key role in our development efforts, collaborating on innovative software solutions in a supportive environment.</p>
    ...
    \nOutput tone should be ${params.tone}.
  `;
};

export const generateResumeKeywordsQuestion = (params: GenerateResumeParams) => {
  if (params.type === ResumeType.SUMMARY) {
    return `
    You are an expert Resume and CV writer with years of experience. Create concise keywords for a professional Resume Summary for a ${params.jobTitle} in ${params.language}. 

    Keywords should be 1–5 words, excluding dates, specific locations, or addresses. Example keywords for an IT Business Analyst might include: Agile Methodology, Communication, 1 year experience, Google Project Management certification, IELTS, UML, Figma.

    Limit output to 10 keywords, separated by commas.
    `;
  }
  if (params.type === ResumeType.OBJECTIVE) {
    return `
    As a skilled Resume and CV writer, provide concise keywords for a professional Resume Objective for a ${params.jobTitle} in ${params.language}. 

    Keywords should be 1–5 words, excluding dates, specific locations, or addresses. Example keywords for an IT Business Analyst Objective: Agile Methodology, Communication, 1 year experience, Google Project Management certification, ECBA, IELTS.

    Limit output to 10 keywords, separated by commas.
    `;
  }
  return `
  As an experienced Resume and CV writer, provide keywords for a professional Work Experience description in ${params.language} for a 
  ${params.jobTitle} position at ${params.companyName}, located in ${params.location}, from ${formatDate(params.startDate, EFormatType.MMM_DD_YYYY)}
  to ${params.isCurrentlyWork ? 'Present' : formatDate(params.endDate, EFormatType.MMM_DD_YYYY)}.

  Keywords should be 1–5 words, without dates, specific locations, or addresses. Example Work Experience keywords for a Customer Service Representative: increased customer engagement, top performance ratings, problem resolution.

  Limit output to 10 keywords, separated by commas.
  `;
};

export const generateResumeDescriptionQuestion = (params: GenerateResumeParams) => {
  if (params.type === ResumeType.SUMMARY) {
    return `
    As a professional Resume and CV Writing Expert, create a clear Resume Objective for a ${params.jobTitle} in ${params.language}.
    
    Help me to creating a CV and need a professional summary and Resume Summary for a ${params.jobTitle} with ${params.yearsOfExperience}.
    
    The Resume Summary should emphasize skills in ${params.keywords} and key achievements. The summary should be a short paragraph, in plain style (no bold or headings), accurately reflecting years of experience if noted in keywords
   
    The career summary should reflect my goal of ${params?.careerGoals}. Please keep it professional, concise, and engaging, tailored for a hiring manager in [your industry, e.g., tech or software development]."
    
    Example summary for a Mid-Level Software Engineer: "<p>Dedicated Software Engineer with expertise in AI and Machine Learning solutions, experienced in leading teams and advancing software innovations.</p>".

    Limit output to 50 words in a plain paragraph format.
    `;
  }
  if (params.type === ResumeType.OBJECTIVE) {
    return `
      As a professional Objective and CV Writing Expert, create a clear Objective Objective for a ${params.jobTitle} in ${params.language}.
    
      Help me to creating a CV and need a professional objective and Objective Objective for a ${params.jobTitle} with ${params.yearsOfExperience}.
    
      The Objective should emphasize skills in ${params.keywords} and key achievements. The objective should be a short paragraph, in plain style (no bold or headings), accurately reflecting years of experience if noted in keywords
   
      The career objective should reflect my goal of ${params?.careerGoals}. Please keep it professional, concise, and engaging, tailored for a hiring manager in [your industry, e.g., tech or software development]."
    
      Example objective for an IT Manager: "<p>Aspiring to bring years of industry expertise to help achieve strategic objectives...</p>".

      Limit output to a brief, impactful paragraph.
    `;
  }
};
