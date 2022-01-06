class Customer < ApplicationRecord
    has_one :item
    belongs_to :group

    # validates :name, format: { with: /\A[a-zA-Z]+\z/,
    # message: "only allows letters" }
    # validates :email, :uniqueness => { :message => "already taken"}
    # validates :name, uniqueness: { scope: :email,
    # message: "should happen once per email" }

end
