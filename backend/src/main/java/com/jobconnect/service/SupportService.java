package com.jobconnect.service;

import com.jobconnect.dto.support.ComplaintCreateDto;
import com.jobconnect.dto.support.ComplaintResponseDto;
import com.jobconnect.dto.support.ComplaintStatusUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SupportService {

    ComplaintResponseDto createTicket(ComplaintCreateDto dto);
    Page<ComplaintResponseDto> getMyTickets(Pageable pageable);
    Page<ComplaintResponseDto> getAllTickets(String status, String priority, Pageable pageable);
    ComplaintResponseDto getTicketDetails(String ticketId);
    ComplaintResponseDto updateTicket(String ticketId, ComplaintStatusUpdateDto dto);
}
