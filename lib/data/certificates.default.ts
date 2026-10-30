/**
 * Certificates Data (Default/Static)
 * Verified professional credentials and accreditations.
 */

import type { Certificate } from "@/lib/types";

export const certificatesDefault: Certificate[] = [
  {
    id: "cert-aws-saa",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services (AWS)",
    issueDate: "2024-03-15",
    expirationDate: "2027-03-15",
    credentialId: "AWS-SAA-8849204",
    credentialUrl: "https://aws.amazon.com/verification",
    image: "/images/certificates/aws-saa.svg",
  },
  {
    id: "cert-gcp-pca",
    name: "Professional Cloud Architect",
    issuer: "Google Cloud",
    issueDate: "2023-11-10",
    expirationDate: "2025-11-10",
    credentialId: "GCP-PCA-930219",
    credentialUrl: "https://cloud.google.com/certification",
    image: "/images/certificates/gcp-pca.svg",
  },
  {
    id: "cert-meta-fed",
    name: "Meta Certified Front-End Developer",
    issuer: "Meta",
    issueDate: "2023-08-20",
    isLifetime: true,
    credentialId: "META-FED-554109",
    credentialUrl: "https://www.coursera.org/account/accomplishments/professional-cert/meta",
    image: "/images/certificates/meta-fed.svg",
  },
  {
    id: "cert-hashi-ta",
    name: "HashiCorp Certified: Terraform Associate",
    issuer: "HashiCorp",
    issueDate: "2024-01-18",
    expirationDate: "2026-01-18",
    credentialId: "HASHI-TA-771829",
    credentialUrl: "https://www.credly.com/org/hashicorp",
    image: "/images/certificates/terraform.svg",
  },
  {
    id: "cert-cncf-cka",
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Linux Foundation & CNCF",
    issueDate: "2024-06-05",
    expirationDate: "2027-06-05",
    credentialId: "CKA-2400-88194",
    credentialUrl: "https://www.cncf.io/certification/cka/",
    image: "/images/certificates/cka.svg",
  },
  {
    id: "cert-edb-pg15",
    name: "Advanced PostgreSQL 15 DBA & Performance",
    issuer: "EnterpriseDB",
    issueDate: "2023-05-12",
    isLifetime: true,
    credentialId: "EDB-PG15-44210",
    credentialUrl: "https://www.enterprisedb.com",
    image: "/images/certificates/postgres.svg",
  },
];
