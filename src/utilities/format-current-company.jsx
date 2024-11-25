export const findAndSetCompanyName = (companies, user, setCompanyName) => {
  const matchedCompany = companies.find(company => user.codEmpresa === company.codEmpresa);
  if (matchedCompany) {
    setCompanyName(matchedCompany.nomEmpresa);
  }
};
