// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CivicReportRegistry {
    mapping(string => string) public reportHashes;

    event ReportLogged(
        string reportId,
        string complaintHash
    );

    function logReport(
        string memory reportId,
        string memory complaintHash
    ) public {
        reportHashes[reportId] = complaintHash;
        emit ReportLogged(reportId, complaintHash);
    }
}
