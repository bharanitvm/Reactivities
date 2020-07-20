using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string>
        ruleBUilder)
        {
            var options = ruleBUilder
                .NotEmpty().MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Matches("[A-Z]").WithMessage("Password must contain 1 uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain 1 lowercase character")
                .Matches("[0-1]").WithMessage("Password must contain a number")
                .Matches("[^a-zA-Z0-0]").WithMessage("Password must contain non alphanumeric")
                ;
        return options;
        }

        

    }
}