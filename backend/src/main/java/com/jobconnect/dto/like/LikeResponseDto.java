package com.jobconnect.dto.like;

public class LikeResponseDto {
    private Long candidateId;
    private Long employerId;
    private boolean liked;
    private long totalLikes;
    private String message;

    public LikeResponseDto() {}

    public LikeResponseDto(Long candidateId, Long employerId, boolean liked, long totalLikes, String message) {
        this.candidateId = candidateId;
        this.employerId = employerId;
        this.liked = liked;
        this.totalLikes = totalLikes;
        this.message = message;
    }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public Long getEmployerId() { return employerId; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }

    public boolean isLiked() { return liked; }
    public void setLiked(boolean liked) { this.liked = liked; }

    public long getTotalLikes() { return totalLikes; }
    public void setTotalLikes(long totalLikes) { this.totalLikes = totalLikes; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
