package com.jobconnect.controller;

import com.jobconnect.dto.support.ComplaintCreateDto;
import com.jobconnect.dto.support.ComplaintResponseDto;
import com.jobconnect.dto.support.ComplaintStatusUpdateDto;
import com.jobconnect.service.SupportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/complaints", "/api/support/tickets", "/api/support"})
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping
    public ResponseEntity<ComplaintResponseDto> createTicket(@Valid @RequestBody ComplaintCreateDto dto) {
        return ResponseEntity.ok(supportService.createTicket(dto));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ComplaintResponseDto>> getMyTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(supportService.getMyTickets(pageable));
    }

    @GetMapping
    public ResponseEntity<Page<ComplaintResponseDto>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(supportService.getAllTickets(status, priority, pageable));
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<ComplaintResponseDto> getTicketDetails(@PathVariable String ticketId) {
        return ResponseEntity.ok(supportService.getTicketDetails(ticketId));
    }

    @PatchMapping({"/{ticketId}", "/{ticketId}/status"})
    public ResponseEntity<ComplaintResponseDto> updateTicket(
            @PathVariable String ticketId, @RequestBody ComplaintStatusUpdateDto dto) {
        return ResponseEntity.ok(supportService.updateTicket(ticketId, dto));
    }
}
