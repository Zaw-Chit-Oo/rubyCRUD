class ApplicationController < ActionController::Base
    rescue_from ActiveRecord::RecordNotFound, with: :not_found_record


    private
    def not_found_record(e)
        render json: { errors: t("message.M006") }, status: :ok
    end
end
