import json
from typing import Optional
from google import genai
from app.config import get_settings
from app.score.models.resume_model import ResumeData

settings = get_settings()


def _build_resume_text(data: ResumeData) -> str:
    """Convert resume data to a text representation for LLM analysis."""
    sections = []

    pi = data.personal_info
    sections.append(f"Name: {pi.full_name}")
    sections.append(f"Email: {pi.email}")
    if pi.phone:
        sections.append(f"Phone: {pi.phone}")
    if pi.location:
        sections.append(f"Location: {pi.location}")
    if pi.summary:
        sections.append(f"\nSummary:\n{pi.summary}")

    if data.experience:
        sections.append("\n--- Experience ---")
        for exp in data.experience:
            sections.append(f"\n{exp.position} at {exp.company}")
            if exp.location:
                sections.append(f"Location: {exp.location}")
            sections.append(f"Duration: {exp.start_date} - {'Present' if exp.current else exp.end_date}")
            if exp.description:
                sections.append(exp.description)
            for h in exp.highlights:
                sections.append(f"  • {h}")

    if data.education:
        sections.append("\n--- Education ---")
        for edu in data.education:
            sections.append(f"\n{edu.degree} in {edu.field_of_study}")
            sections.append(f"{edu.institution}")
            sections.append(f"Duration: {edu.start_date} - {edu.end_date}")
            if edu.gpa:
                sections.append(f"GPA: {edu.gpa}")

    if data.skills:
        sections.append(f"\n--- Skills ---\n{', '.join(data.skills)}")

    if data.projects:
        sections.append("\n--- Projects ---")
        for proj in data.projects:
            sections.append(f"\n{proj.name}")
            if proj.description:
                sections.append(proj.description)
            if proj.technologies:
                sections.append(f"Tech: {', '.join(proj.technologies)}")

    if data.certifications:
        sections.append("\n--- Certifications ---")
        for cert in data.certifications:
            sections.append(f"{cert.name} - {cert.issuer} ({cert.date})")

    if data.languages:
        sections.append(f"\n--- Languages ---\n{', '.join(data.languages)}")

    return "\n".join(sections)


async def score_resume(
    resume_data: ResumeData, job_description: Optional[str] = None
) -> dict:
    """Score a resume using Gemini LLM and return structured analysis."""

    resume_text = _build_resume_text(resume_data)

    jd_context = ""
    if job_description:
        jd_context = f"""
Additionally, evaluate how well this resume matches the following job description:
---
{job_description}
---
"""

    prompt = f"""You are an expert resume reviewer and career advisor. Analyze the following resume thoroughly and provide a detailed scoring and analysis.

Resume:
---
{resume_text}
---
{jd_context}

Provide your analysis in the following JSON format ONLY (no other text, no markdown code blocks):
{{
    "overall_score": <integer 0-100>,
    "categories": [
        {{
            "name": "Content Quality",
            "score": <integer 0-100>,
            "feedback": "<detailed feedback>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>"]
        }},
        {{
            "name": "Format & Structure",
            "score": <integer 0-100>,
            "feedback": "<detailed feedback>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>"]
        }},
        {{
            "name": "Impact & Achievements",
            "score": <integer 0-100>,
            "feedback": "<detailed feedback>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>"]
        }},
        {{
            "name": "Skills Relevance",
            "score": <integer 0-100>,
            "feedback": "<detailed feedback>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>"]
        }},
        {{
            "name": "ATS Optimization",
            "score": <integer 0-100>,
            "feedback": "<detailed feedback>",
            "suggestions": ["<suggestion 1>", "<suggestion 2>"]
        }}
    ],
    "summary": "<overall summary of the resume in 2-3 sentences>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
    "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>", "<recommendation 4>"],
    "ats_friendly": <true or false>
}}

Be thorough, constructive, and specific in your feedback. Score fairly but don't be overly generous."""

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        response_text = response.text.strip()
        # Clean up potential markdown code blocks
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
        if response_text.endswith("```"):
            response_text = response_text.rsplit("```", 1)[0]
        response_text = response_text.strip()

        result = json.loads(response_text)
        return result

    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse LLM response: {str(e)}")
    except Exception as e:
        raise ValueError(f"LLM scoring failed: {str(e)}")


async def parse_resume_text(text: str) -> dict:
    """Use LLM to parse raw resume text into structured data."""

    prompt = f"""You are an expert resume parser. Parse the following resume text into structured JSON data.

Resume Text:
---
{text}
---

Return ONLY valid JSON in this exact format (no markdown code blocks, no other text):
{{
    "personal_info": {{
        "full_name": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "github": "",
        "portfolio": "",
        "summary": ""
    }},
    "education": [
        {{
            "institution": "",
            "degree": "",
            "field_of_study": "",
            "start_date": "",
            "end_date": "",
            "gpa": "",
            "description": ""
        }}
    ],
    "experience": [
        {{
            "company": "",
            "position": "",
            "location": "",
            "start_date": "",
            "end_date": "",
            "current": false,
            "description": "",
            "highlights": []
        }}
    ],
    "skills": [],
    "projects": [
        {{
            "name": "",
            "description": "",
            "technologies": [],
            "url": "",
            "start_date": "",
            "end_date": ""
        }}
    ],
    "certifications": [
        {{
            "name": "",
            "issuer": "",
            "date": "",
            "url": ""
        }}
    ],
    "languages": [],
    "interests": []
}}

Extract all information accurately. If a field is not found, leave it as empty string or empty array."""

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
        if response_text.endswith("```"):
            response_text = response_text.rsplit("```", 1)[0]
        response_text = response_text.strip()

        return json.loads(response_text)

    except Exception as e:
        raise ValueError(f"Resume parsing failed: {str(e)}")
